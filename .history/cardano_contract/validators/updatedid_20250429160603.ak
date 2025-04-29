use aiken/crypto.{VerificationKeyHash}
use cardano/address
use cardano/assets.{without_lovelace}
use cardano/transaction.{
  InlineDatum, Output, OutputReference, Transaction, find_input,
}
use cardano/tx
use smart_contract/types.{Remove, StoreRedeemer, Update}
use cardano_contract/utils
use types/cip68.{CIP68}
use validation/find.{output_by_addr_value}

validator store(
  platform: VerificationKeyHash,
  platform_fee: Int,
  issuer: VerificationKeyHash,
) {
  spend(
    datum: Option<CIP68>,
    redeemer: StoreRedeemer,
    output_reference: OutputReference,
    transaction: Transaction,
  ) {
    expect Some(datum_input) = datum
    let Transaction { inputs, outputs, extra_signatories, .. } = transaction
    let platform_address = address.from_verification_key(platform)
    let output_utxo_platform =
      utils.find_output(outputs, platform_fee, platform_address)
    expect Some(input) = find_input(inputs, output_reference)
    let script_address = input.output.address
    let reference_token =
      input.output.value
        |> without_lovelace()
    let metadatum_input: CIP68 = datum_input
    expect author_input: ByteArray =
      cip68.get(metadatum_input, types.author_key)
    let signed_by_author = tx.verify_signature(extra_signatories, author_input)

    when signed_by_author is {
      False -> False
      True ->
        when redeemer is {
          Update -> {
            let utxo_output =
              output_by_addr_value(outputs, script_address, reference_token)
            expect InlineDatum(datum_output) = utxo_output.datum
            expect metadatum_output: CIP68 = datum_output
            expect author_input: ByteArray =
              cip68.get(metadatum_input, types.author_key)
            expect author_output: ByteArray =
              cip68.get(metadatum_output, types.author_key)
            let check_author = author_input == author_output
            and {
              utils.check_output_utxo(utxo_output, issuer, extra_signatories)?,
              utils.check_output_update(inputs, outputs, script_address),
              output_utxo_platform != None,
              check_author,
            }
          }
          Remove -> {
            let author_address = address.from_verification_key(author_input)
            utils.check_output_remove(
              outputs,
              platform_address,
              platform_fee,
              author_address,
            )
          }
        }
    }
  }

  else(_) {
    fail
  }
}
