;; Royalty Distribution Contract

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-unauthorized (err u102))

;; Maps
(define-map royalty-payments
  { payment-id: uint }
  {
    licensor: principal,
    licensee: principal,
    amount: uint,
    timestamp: uint
  }
)

(define-data-var last-payment-id uint u0)

;; Public Functions
(define-public (distribute-royalty (licensor principal) (amount uint))
  (let
    (
      (payment-id (+ (var-get last-payment-id) u1))
    )
    (try! (stx-transfer? amount tx-sender licensor))
    (map-set royalty-payments
      { payment-id: payment-id }
      {
        licensor: licensor,
        licensee: tx-sender,
        amount: amount,
        timestamp: block-height
      }
    )
    (var-set last-payment-id payment-id)
    (ok payment-id)
  )
)

;; Read-only Functions
(define-read-only (get-royalty-payment (payment-id uint))
  (map-get? royalty-payments { payment-id: payment-id })
)

(define-read-only (get-last-payment-id)
  (ok (var-get last-payment-id))
)

