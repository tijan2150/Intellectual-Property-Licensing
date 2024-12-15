;; IP-NFT Contract

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-already-listed (err u102))

;; Data Variables
(define-data-var last-token-id uint u0)

;; IP Types
(define-data-var ip-types (list 3 (string-ascii 20)) (list "patent" "copyright" "trademark"))

;; Maps
(define-map ip-assets
  { token-id: uint }
  {
    owner: principal,
    ip-type: (string-ascii 20),
    title: (string-ascii 100),
    description: (string-ascii 500),
    registration-number: (string-ascii 50),
    expiration-date: uint,
    is-listed: bool,
    price: uint
  }
)

;; Define NFT
(define-non-fungible-token ip-nft uint)

;; Mint IP-NFT
(define-public (mint-ip-nft (ip-type (string-ascii 20)) (title (string-ascii 100)) (description (string-ascii 500)) (registration-number (string-ascii 50)) (expiration-date uint))
  (let
    (
      (token-id (+ (var-get last-token-id) u1))
    )
    (asserts! (is-valid-ip-type ip-type) (err u103))
    (try! (nft-mint? ip-nft token-id tx-sender))
    (map-set ip-assets
      { token-id: token-id }
      {
        owner: tx-sender,
        ip-type: ip-type,
        title: title,
        description: description,
        registration-number: registration-number,
        expiration-date: expiration-date,
        is-listed: false,
        price: u0
      }
    )
    (var-set last-token-id token-id)
    (ok token-id)
  )
)

;; List IP-NFT
(define-public (list-ip-nft (token-id uint) (price uint))
  (let
    (
      (asset (unwrap! (map-get? ip-assets { token-id: token-id }) (err u101)))
    )
    (asserts! (is-eq tx-sender (get owner asset)) err-owner-only)
    (asserts! (not (get is-listed asset)) err-already-listed)
    (map-set ip-assets
      { token-id: token-id }
      (merge asset { is-listed: true, price: price })
    )
    (ok true)
  )
)

;; Unlist IP-NFT
(define-public (unlist-ip-nft (token-id uint))
  (let
    (
      (asset (unwrap! (map-get? ip-assets { token-id: token-id }) (err u101)))
    )
    (asserts! (is-eq tx-sender (get owner asset)) err-owner-only)
    (map-set ip-assets
      { token-id: token-id }
      (merge asset { is-listed: false, price: u0 })
    )
    (ok true)
  )
)

;; Transfer IP-NFT
(define-public (transfer (token-id uint) (recipient principal))
  (let
    (
      (asset (unwrap! (map-get? ip-assets { token-id: token-id }) (err u101)))
    )
    (asserts! (is-eq tx-sender (get owner asset)) err-owner-only)
    (try! (nft-transfer? ip-nft token-id tx-sender recipient))
    (map-set ip-assets
      { token-id: token-id }
      (merge asset { owner: recipient, is-listed: false, price: u0 })
    )
    (ok true)
  )
)

;; Get IP-NFT Details
(define-read-only (get-ip-nft (token-id uint))
  (map-get? ip-assets { token-id: token-id })
)

;; Get Owner
(define-read-only (get-owner (token-id uint))
  (ok (nft-get-owner? ip-nft token-id))
)

;; Get Last Token ID
(define-read-only (get-last-token-id)
  (ok (var-get last-token-id))
)

;; Helper function to check if IP type is valid
(define-private (is-valid-ip-type (ip-type (string-ascii 20)))
  (is-some (index-of (var-get ip-types) ip-type))
)

