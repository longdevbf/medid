use cardano/transaction.{OutputReference, Transaction, Input, Output}
use aiken/crypto.{VerificationKeyHash, ScriptHash}
use aiken/collection/list
use cardano/address.{VerificationKey, Script}
pub type Datum {
    patient: VerificationKeyHash,
    doctor: List<VerificationKeyHash>,
    unit: ByteArray

}
pub fn find_input(
  inputs: List<Input>,
  output_reference: OutputReference,
) -> Option<Input> {
  inputs
    |> list.find(fn(input) { input.output_reference == output_reference })
}
//check signature of extra_signatories

pub fn key_signed(extra_signatories: List<ByteArray>, key: ByteArray) {
  list.has(extra_signatories, key)
}
pub fn find_script_outputs(
  outputs: List<Output>,
  script_hash: ScriptHash,
) -> List<Output> {
  outputs
    |> list.filter(
        fn(output) {
          when output.address.payment_credential is {
            Script(addr_script_hash) -> script_hash == addr_script_hash
            VerificationKey(_) -> False
          }
        },
      )
}

//check if any of the keys are signed by the extra_signatories
pub fn one_of_keys_signed(
  extra_signatories: List<ByteArray>,
  keys: List<ByteArray>,
) {
  list.any(keys, fn(key) { key_signed(extra_signatories, key) })
}
validator action1{
    spend(datum_otp: Option<Datum>, _redeemer: Data, _out_ref: OutputReference, tx: Transaction){
        expect Some(datum) = datum_otp
       or{
        key_signed(tx.extra_signatories, datum.patient) ,
        one_of_keys_signed(tx.extra_signatories, datum.doctor)
       } 
    }
    else(_) {
        fail
    }

}