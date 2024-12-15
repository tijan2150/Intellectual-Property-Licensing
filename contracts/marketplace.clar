;; Marketplace Contract

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-unauthorized (err u102))

;; Data Variables
(define-data-var last-sale-id uint u0)

;; Maps
(define-map sales
  { sale-id: uint }
  {
    seller: principal,
    asset-id: uint,
    price: uint,
    is-active: bool
  }
)

;; Public Functions
(define-public (list-for-sale (asset-id uint) (price uint))
  (let
    (
      (sale-id (+ (var-get last-sale-id) u1))
    )
    (map-set sales
      { sale-id: sale-id }
      {
        seller: tx-sender,
        asset-id: asset-id,
        price: price,
        is-active: true
      }
    )
    (var-set last-sale-id sale-id)
    (ok sale-id)
  )
)

(define-public (cancel-sale (sale-id uint))
  (let
    (
      (sale (unwrap! (map-get? sales { sale-id: sale-id }) err-not-found))
    )
    (asserts! (is-eq tx-sender (get seller sale)) err-unauthorized)
    (map-set sales
      { sale-id: sale-id }
      (merge sale { is-active: false })
    )
    (ok true)
  )
)

(define-public (buy-asset (sale-id uint))
  (let
    (
      (sale (unwrap! (map-get? sales { sale-id: sale-id }) err-not-found))
    )
    (asserts! (get is-active sale) err-not-found)
    (try! (stx-transfer? (get price sale) tx-sender (get seller sale)))
    (map-set sales
      { sale-id: sale-id }
      (merge sale { is-active: false })
    )
    (ok true)
  )
)

;; Read-only Functions
(define-read-only (get-sale (sale-id uint))
  (map-get? sales { sale-id: sale-id })
)

(define-read-only (get-last-sale-id)
  (ok (var-get last-sale-id))
)

