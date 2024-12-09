import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [transactionAmount, setTransactionAmount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [balance, setBalance] = useState(0);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [usdBalance, setUsdBalance] = useState(0);
  const [eurBalance, setEurBalance] = useState(0);

  const createUser = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/create_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId, password }),
        credentials: "include",
      });
      const data = await response.json();

      if (response.ok) {
        toast.success(`Kullanıcı başarıyla oluşturuldu!`);
      } else {
        toast.error(`Hata: ${data.error} `);
      }
    } catch (error) {
      toast.error(`Kullanıcı oluşturma hatası `);
      console.error("Kullanıcı oluşturma hatası:", error);
    }
  };

  const login = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId, password }),
        credentials: "include",
      });
      const data = await response.json();

      if (response.ok) {
        setIsLoggedIn(true);
        toast.success(`Giriş başarılı!`);
        await getBalance();
      } else {
        toast.error(`Hata: ${data.error}`);
      }
    } catch (error) {
      toast.error(`Giriş yapma hatası `);
      console.error("Giriş yapma hatası:", error);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/logout", {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();

      if (response.ok) {
        setIsLoggedIn(false);
        toast.success(`Çıkış yapıldı!`);
      } else {
        toast.error(`Hata: ${data.error}`);
      }
    } catch (error) {
      toast.error(`Çıkış yapma hatası `);
      console.error("Çıkış yapma hatası:", error);
    }
  };

  const updateBalance = async () => {
    const startTime = performance.now();
    try {
      const response = await fetch("http://127.0.0.1:5000/update_balance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transaction_amount: parseFloat(transactionAmount),
        }),
        credentials: "include",
      });
      const data = await response.json();
      const endTime = performance.now();
      const elapsedTime = (endTime - startTime).toFixed(2);

      if (response.ok) {
        toast.success(`Bakiye güncellendi! Süre: ${elapsedTime} ms`);
        await getBalance();
      } else {
        toast.error(`Hata: ${data.error} (Süre: ${elapsedTime} ms)`);
      }
    } catch (error) {
      toast.error(`Bakiye güncelleme hatası )`);
      console.error("Bakiye güncelleme hatası:", error);
    }
  };

  const getBalance = async () => {
    const startTime = performance.now();
    try {
      const response = await fetch("http://127.0.0.1:5000/get_balance", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      const endTime = performance.now();
      const elapsedTime = (endTime - startTime).toFixed(2);

      if (response.ok) {
        setBalance(data.decrypted_balance);
        toast.success(
          `Bakiyeniz: ${data.decrypted_balance} TL (Süre: ${elapsedTime} ms)`
        );
      } else {
        toast.error(`Hata: ${data.error} (Süre: ${elapsedTime} ms)`);
      }
    } catch (error) {
      toast.error(`Bakiye alma hatası `);
      console.error(error);
    }
  };

  const getBalanceInCurrencies = async () => {
    const startTime = performance.now();
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/get_balance_in_currencies",
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      const endTime = performance.now();
      const elapsedTime = (endTime - startTime).toFixed(2);

      if (response.ok) {
        setUsdBalance(data.usd_balance);
        setEurBalance(data.eur_balance);
        toast.success(
          `Döviz bakiyesi başarıyla alındı! (Süre: ${elapsedTime} ms)`
        );
      } else {
        toast.error(`Hata: ${data.error} (Süre: ${elapsedTime} ms)`);
      }
    } catch (error) {
      toast.error(`Bakiyeyi döviz cinsinden alma hatası )`);
      console.error("Bakiyeyi döviz cinsinden alma hatası:", error);
    }
  };

  const getTransactionHistory = async () => {
    const startTime = performance.now();
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/get_transaction_history",
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      const endTime = performance.now();
      const elapsedTime = (endTime - startTime).toFixed(2);

      if (response.ok) {
        setTransactionHistory(data.transaction_history);
        toast.success(
          `İşlem geçmişi başarıyla alındı! (Süre: ${elapsedTime} ms)`
        );
      } else {
        toast.error(`Hata: ${data.error} (Süre: ${elapsedTime} ms)`);
      }
    } catch (error) {
      toast.error(`İşlem geçmişi alma hatası`);
      console.error("İşlem geçmişi alma hatası:", error);
    }
  };

  return (
    <div className="App">
      <ToastContainer position="bottom-right" autoClose={3000} />
      {!isLoggedIn ? (
        <div className="form-container">
          <div className="card">
            <h2>Kayıt Ol</h2>
            <input
              type="text"
              placeholder="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={createUser}>Kayıt Ol</button>
          </div>
          <div className="card">
            <h2>Giriş Yap</h2>
            <input
              type="text"
              placeholder="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={login}>Giriş Yap</button>
          </div>
        </div>
      ) : (
        <div className="form-container">
          <button onClick={logout}>Çıkış Yap</button>
          <div className="card">
            <h2>Bakiye Güncelle</h2>
            <input
              type="number"
              placeholder="Miktar"
              value={transactionAmount}
              onChange={(e) => setTransactionAmount(e.target.value)}
            />
            <button onClick={updateBalance}>Güncelle</button>
          </div>
          <div className="card">
            <h2>Bakiye: {balance} TL</h2>
          </div>
          <div className="card">
            <h2>Bakiyeniz</h2>
            <button onClick={getBalanceInCurrencies}>
              Bakiyeyi Döviz Cinsinden Göster
            </button>
            {usdBalance > 0 && eurBalance > 0 && (
              <div>
                <p>USD Bakiyesi: {usdBalance.toFixed(2)} USD</p>
                <p>EUR Bakiyesi: {eurBalance.toFixed(2)} EUR</p>
              </div>
            )}
          </div>
          <div className="card">
            <h2>İşlem Geçmişiniz</h2>
            <button onClick={getTransactionHistory}>
              İşlem Geçmişini Görüntüle
            </button>
            {transactionHistory.length > 0 ? (
              <ul>
                {transactionHistory.map((txn, index) => (
                  <li key={index}>
                    {txn.type === "add" ? "Ekleme" : "Çıkarma"}:{" "}
                    {txn.encrypted_amount}
                  </li>
                ))}
              </ul>
            ) : (
              <p>İşlem geçmişiniz bulunmamaktadır.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
