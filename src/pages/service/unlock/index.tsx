import React, { useState } from "react";
import styles from "./Unlock.module.css";

const Unlock: React.FC = () => {
    const [txHash, setTxHash] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleUnlock = () => {
        setError("");
        setSuccess("");

        if (!txHash || txHash.length < 10) {
            setError("Please enter a valid transaction hash");
            return;
        }

        setLoading(true);

        setTimeout(() => {
            if (txHash.length >= 10) {
                setLoading(false);
                setSuccess("Transaction verified successfully! Unlocking...");
                setTimeout(() => {
                    alert("Unlock successful! Redirecting to secure area...");
                    // window.location.href = '/secure-area';
                }, 2000);
            } else {
                setLoading(false);
                setError("Invalid transaction hash. Please try again.");
            }
        }, 1500);
    };

    return (
        <section className={styles["main-content"]}>
            <div className="container">
                <div className={styles["unlock-card"]}>
                    <h2>Transaction Verification</h2>
                    <div className={styles["form-group"]}>
                        <label htmlFor="txHash">Transaction Hash (txHash)</label>
                        <input
                            type="text"
                            id="txHash"
                            placeholder="Enter your transaction hash"
                            autoComplete="off"
                            value={txHash}
                            onChange={(e) => {
                                setTxHash(e.target.value);
                                setError("");
                                setSuccess("");
                            }}
                        />
                        {error && (
                            <div className={styles["error-message"]}>{error}</div>
                        )}
                        {success && (
                            <div className={styles["success-message"]}>{success}</div>
                        )}
                    </div>
                    {loading && <div className={styles.loading}></div>}
                    {!loading && (
                        <button
                            className={styles["unlock-btn"]}
                            onClick={handleUnlock}
                        >
                            Unlock Access
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
            </div>
        </section>
    );
};

export default Unlock;
