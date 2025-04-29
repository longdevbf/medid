use aiken/collection/list
use aiken/crypto.{ScriptHash, VerificationKeyHash}
use cardano/address
use cardano/assets.{PolicyId, without_lovelace}
use cardano/transaction.{Transaction}
use smart_contract/types.{Burn, Mint, MintRedeemer}
use smart_contract/utils
use types/cip68
//refer to cip68generator
validator mint(
  platform: VerificationKeyHash,
  platform_fee: Int,
  store_payment_credential: ScriptHash,
  store_stake_credential: VerificationKeyHash,
  issuer: VerificationKeyHash,
) {
  mint(redeemer: MintRedeemer, policy_id: PolicyId, transaction: Transaction) {
    let Transaction { inputs, outputs, extra_signatories, mint, .. } =
      transaction
    let mint_flatten =
      mint
        |> without_lovelace()
        |> assets.flatten()
    let store_address =
      store_payment_credential
        |> address.from_script()
        |> address.with_delegation_key(store_stake_credential)
    let platform_address = address.from_verification_key(platform)
    let output_utxo_platform =
      utils.find_output(outputs, platform_fee, platform_address)
    let check_output_platform = output_utxo_platform != None
    when redeemer is {
      Mint -> {
        let check_asset_mint =
          utils.check_asset_mint(
            mint_flatten,
            policy_id,
            cip68.prefix_100,
            cip68.prefix_222,
            outputs,
            store_address,
            issuer,
            extra_signatories,
            False,
          )
        and {
          check_asset_mint?,
          check_output_platform?,
        }
      }
      Burn -> {
        let reference_asset =
          utils.find_input_reference_asset(inputs, extra_signatories)

        if list.length(reference_asset) > 0 {
          let mint_concat = list.concat(reference_asset, mint_flatten)
          let check_asset_burn =
            utils.check_asset_burn(
              mint_concat,
              policy_id,
              cip68.prefix_100,
              cip68.prefix_222,
            )
          and {
            check_asset_burn?,
            check_output_platform?,
          }
        } else {
          let check_asset_burn =
            utils.check_assets_prefix(mint_flatten, policy_id, cip68.prefix_222)
          and {
            check_asset_burn?,
            check_output_platform?,
          }
        }
      }
    }
  }

  else(_) {
    fail
  }
}
