import React, { useState } from "react";
import { useWallet } from '@meshsdk/react';
import styles from "./Unlock.module.css";
import unlockAndPaymentPortfolio from "../../../utils/DoctorAction/utils/unlock";

const Unlock: React.FC = () => {
    const { wallet, connected } = useWallet();
    const [txHash, setTxHash] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleUnlock = async () => {
        setError("");
        setSuccess("");

        if (!connected) {
            setError("Please connect your Cardano wallet first");
            return;
        }

        if (!txHash || txHash.length < 64) {
            setError("Please enter a valid transaction hash (64 characters)");
            return;
        }

        try {
            setLoading(true);
            setSuccess("Verifying transaction on blockchain...");

            // Gọi hàm unlock từ smart contract
            const resultTxHash = await unlockAndPaymentPortfolio(wallet, txHash);
            
            // Hiển thị kết quả thành công
            setLoading(false);
            setSuccess(`Transaction processed successfully! Your medical records are now unlocked. Transaction ID: ${resultTxHash}`);

            // Hiển thị link đến trình duyệt blockchain
            const txLink = document.getElementById('tx-success-link');
            if (txLink) {
                txLink.innerHTML = `<a href="https://preprod.cardanoscan.io/transaction/${resultTxHash}" target="_blank" rel="noopener noreferrer" class="${styles.txLink}">View on Cardanoscan <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></a>`;
            }
        } catch (error) {
            console.error("Error unlocking assets:", error);
            setLoading(false);
            setError(`Transaction processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    return (
        <section className={styles["main-content"]}>
            <div className="container">
                <div className={styles["unlock-card"]}>
                    <h2>Medical Record Unlock</h2>
                    
                    {!connected && (
                        <div className={styles["wallet-warning"]}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            <p>Please connect your Cardano wallet to unlock medical records</p>
                        </div>
                    )}
                    
                    <div className={styles["form-group"]}>
                        <label htmlFor="txHash">Transaction Hash (txHash)</label>
                        <input
                            type="text"
                            id="txHash"
                            placeholder="Enter the transaction hash of locked medical record"
                            autoComplete="off"
                            value={txHash}
                            onChange={(e) => {
                                setTxHash(e.target.value);
                                setError("");
                                setSuccess("");
                            }}
                        />
                        <div className={styles["input-help"]}>
                            Enter the transaction hash from the locking transaction to unlock your medical record
                        </div>
                        
                        {error && (
                            <div className={styles["error-message"]}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}
                        
                        {success && (
                            <div className={styles["success-message"]}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                                <span>{success}</span>
                                <div id="tx-success-link" className={styles["tx-link-container"]}></div>
                            </div>
                        )}
                    </div>
                    
                    {loading ? (
                        <div className={styles.loading}>
                            <div className={styles.spinner}></div>
                            <p>Processing blockchain transaction...</p>
                        </div>
                    ) : (
                        <button
                            className={styles["unlock-btn"]}
                            onClick={handleUnlock}
                            disabled={!connected || !txHash}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            Unlock Medical Record
                        </button>
                    )}
                </div>

                <div className={styles.features}>
                    <h2 className={styles["features-title"]}>
                        Blockchain Security Features
                    </h2>
                    <div className={styles["features-grid"]}>
                        <div className={styles["feature-card"]}>
                            <div className={styles["feature-icon"]}>
                                <span>🔒</span>
                            </div>
                            <h3>Secure Verification</h3>
                            <p>
                                Multi-layered authentication system with blockchain
                                validation to ensure data integrity and security.
                            </p>
                        </div>
                        <div className={styles["feature-card"]}>
                            <div className={styles["feature-icon"]}>
                                <span>⚡</span>
                            </div>
                            <h3>Instant Access</h3>
                            <p>
                                Access your medical records instantly after verification
                                with our optimized blockchain technology.
                            </p>
                        </div>
                        <div className={styles["feature-card"]}>
                            <div className={styles["feature-icon"]}>
                                <span>🛡️</span>
                            </div>
                            <h3>Privacy Protection</h3>
                            <p>
                                Complete control over your healthcare data with enhanced
                                privacy features and detailed access logs.
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className={styles["how-it-works"]}>
                    <h2>How Unlocking Works</h2>
                    <div className={styles["steps-container"]}>
                        <div className={styles.step}>
                            <div className={styles["step-number"]}>1</div>
                            <h3>Connect Wallet</h3>
                            <p>Connect your Cardano blockchain wallet to authenticate your identity</p>
                        </div>
                        <div className={styles.step}>
                            <div className={styles["step-number"]}>2</div>
                            <h3>Enter Transaction Hash</h3>
                            <p>Paste the transaction hash from the original locking transaction</p>
                        </div>
                        <div className={styles.step}>
                            <div className={styles["step-number"]}>3</div>
                            <h3>Verify & Pay</h3>
                            <p>The smart contract verifies your credentials and processes the payment</p>
                        </div>
                        <div className={styles.step}>
                            <div className={styles["step-number"]}>4</div>
                            <h3>Access Records</h3>
                            <p>After verification, your medical records are instantly unlocked</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Unlock;