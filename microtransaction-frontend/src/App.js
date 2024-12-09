import React, { useState } from "react";
import "./App.css";

function App() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [transactionAmount, setTransactionAmount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [balance, setBalance] = useState(0); // Bakiyeyi ekledik
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
      alert(data.message || data.error);
    } catch (error) {
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
        alert(data.message);
        await getBalance(); // Giriş yaptıktan sonra bakiyeyi al
      } else {
        alert(data.error);
      }
    } catch (error) {
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
        alert(data.message || "Çıkış yapıldı!");
      }
    } catch (error) {
      console.error("Çıkış yapma hatası:", error);
    }
  };

  const updateBalance = async () => {
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
      alert(data.message || data.error);
      await getBalance(); // Bakiye güncellendikten sonra bakiyeyi tekrar al
    } catch (error) {
      console.error("Bakiye güncelleme hatası:", error);
    }
  };

  const getBalance = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/get_balance", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setBalance(data.decrypted_balance); // Bakiyeyi state'e ekle
        alert(`Bakiyeniz: ${data.decrypted_balance}`);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getBalanceInCurrencies = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/get_balance_in_currencies",
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok) {
        setUsdBalance(data.usd_balance);
        setEurBalance(data.eur_balance);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Bakiyeyi döviz cinsinden alma hatası:", error);
    }
  };

  const getTransactionHistory = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/get_transaction_history",
        {
          method: "GET",
          credentials: "include", // Giriş yapmış kullanıcı için cookie
        }
      );
      const data = await response.json();
      if (response.ok) {
        setTransactionHistory(data.transaction_history); // Gelen veriyi state'e kaydedin
      } else {
        alert(data.error || "İşlem geçmişi alınırken bir hata oluştu");
      }
    } catch (error) {
      console.error("İşlem geçmişi alma hatası:", error);
    }
  };
  return (
    <div className="App">
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
            <h2>Bakiye: {balance} TL</h2> {/* Güncel bakiye burada */}
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
