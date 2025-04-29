use cardano/transaction.{OutputReference, Transaction}
use aiken/crypto.{VerificationKeyHash}
use aiken/collection/list


pub type Datum {
    patient: VerificationKeyHash,
    doctor: VerificationKeyHash,
    cash_required: Int
}
pub fn key_signed(extra_signatories: List<ByteArray>, key: ByteArray) {
  list.has(extra_signatories, key)
}
pub fn one_of_keys_signed(
  extra_signatories: List<ByteArray>,
  keys: List<ByteArray>,
) {
  list.any(keys, fn(key) { key_signed(extra_signatories, key) })
}
validator action1
{
    spend(datum_otp: Option<Datum>, _redeemer: Data, _out_ref: OutputReference, tx: Transaction){
        expect Some(datum) = datum_otp
       or{
        key_signed(tx.extra_signatories, datum.doctor),
        
        key_signed(tx.extra_signatories, datum.patient)
       
        }
              
    }
    else(_) {
        fail
    }
}