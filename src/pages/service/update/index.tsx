import React, { useState } from "react";
import styles from './Update.module.css';

interface ActionResult {
  message: string;
  type: "success" | "error" | "";
}

const Update: React.FC = () => {
  const [txHash, setTxHash] = useState<string>("");
  const [doctorAddresses, setDoctorAddresses] = useState<string[]>([""]);
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [actionResult, setActionResult] = useState<ActionResult>({
    message: "",
    type: "",
  });

  const handleDoctorChange = (index: number, value: string) => {
    const updated = [...doctorAddresses];
    updated[index] = value;
    setDoctorAddresses(updated);
  };

  const addDoctor = () => {
    setDoctorAddresses([...doctorAddresses, ""]);
  };

  const removeDoctor = (index: number) => {
    if (doctorAddresses.length > 1) {
      const updated = [...doctorAddresses];
      updated.splice(index, 1);
      setDoctorAddresses(updated);
    }
  };

  const resetForm = () => {
    setTxHash("");
    setDoctorAddresses([""]);
    setConfirmed(false);
    setActionResult({ message: "", type: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validDoctors = doctorAddresses.filter((addr) => addr.trim() !== "");

    if (!txHash.startsWith("0x") || txHash.length < 10) {
      setActionResult({ message: "Please enter a valid transaction hash", type: "error" });
      return;
    }

    if (validDoctors.length === 0) {
      setActionResult({ message: "Please enter at least one doctor address", type: "error" });
      return;
    }

    if (!confirmed) {
      setActionResult({ message: "You must confirm authorization before submitting", type: "error" });
      return;
    }

    // Simulate blockchain call
    setActionResult({
      message: "Access permissions updated successfully! Transaction submitted to the blockchain.",
      type: "success",
    });

    console.log({
      txHash,
      doctorAddresses: validDoctors,
    });
  };

  return (
    <div className={styles["main-content"]}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles["info-text"]}>
            This page allows you to update access permissions for your electronic health records (EHR) stored on the blockchain.
            Enter your transaction hash (txHash) and the addresses of doctors you wish to grant access to.
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles["form-group"]}>
              <label className={styles.label} htmlFor="txHash">Transaction Hash (txHash):</label>
              <input className={styles.input}
                type="text"
                id="txHash"
                name="txHash"
                placeholder="0x..."
                required
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
              />
            </div>

            <div className={styles["form-group"]}>
              <label className={styles.label}>Doctor Addresses:</label>
              <div id="doctorAddresses">
                {doctorAddresses.map((addr, index) => (
                  <div className={styles["doctor-entry"]} key={index}>
                    <input
                    className={styles.input}
                      type="text"
                      name="doctorAddress"
                      placeholder="0x..."
                      required
                      value={addr}
                      onChange={(e) => handleDoctorChange(index, e.target.value)}
                    />
                    <button type="button" className={styles.btn} onClick={() => removeDoctor(index)}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" className={styles["add-doctor-btn"]} onClick={addDoctor}>
                <span>+</span> Add Another Doctor
              </button>
            </div>

            <div className={styles["form-group"] + " " + styles["checkbox-group"]}>
              <input className={styles.input}
                type="checkbox"
                id="confirmCheck"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                required
              />
              <label htmlFor="confirmCheck">
                I confirm that I am authorizing these doctors to access my medical records
              </label>
            </div>

            <div className={styles["btn-group"]}>
              <button type="button" className={styles["btn"] + " " + styles["btn-secondary"]} onClick={resetForm}>
                Reset
              </button>
              <button type="submit" className={styles.btn}>
                Update Access
              </button>
            </div>
          </form>

          {actionResult.message && (
            <div
              className={`${styles["action-result"]} ${styles[actionResult.type]}`}
              id="actionResult"
            >
              {actionResult.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Update;