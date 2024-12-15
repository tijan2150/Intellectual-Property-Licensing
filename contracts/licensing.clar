;; Licensing Contract

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-unauthorized (err u102))

;; Data Variables
(define-data-var last-license-id uint u0)

;; Maps
(define-map licenses
  { license-id: uint }
  {
    licensor: principal,
    licensee: principal,
    start-date: uint,
    end-date: uint,
    terms: (string-ascii 1000),
    royalty-rate: uint,
    is-active: bool
  }
)

;; Create License
(define-public (create-license (licensee principal) (start-date uint) (end-date uint) (terms (string-ascii 1000)) (royalty-rate uint))
  (let
    (
      (license-id (+ (var-get last-license-id) u1))
    )
    (map-set licenses
      { license-id: license-id }
      {
        licensor: tx-sender,
        licensee: licensee,
        start-date: start-date,
        end-date: end-date,
        terms: terms,
        royalty-rate: royalty-rate,
        is-active: true
      }
    )
    (var-set last-license-id license-id)
    (ok license-id)
  )
)

;; Terminate License
(define-public (terminate-license (license-id uint))
  (let
    (
      (license (unwrap! (map-get? licenses { license-id: license-id }) err-not-found))
    )
    (asserts! (or (is-eq tx-sender (get licensor license)) (is-eq tx-sender (get licensee license))) err-unauthorized)
    (map-set licenses
      { license-id: license-id }
      (merge license { is-active: false })
    )
    (ok true)
  )
)

;; Get License Details
(define-read-only (get-license (license-id uint))
  (map-get? licenses { license-id: license-id })
)

;; Check if License is Active
(define-read-only (is-license-active (license-id uint))
  (match (map-get? licenses { license-id: license-id })
    license (ok (get is-active license))
    (err err-not-found)
  )
)

