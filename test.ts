// テストはここに来ます。このパッケージが拡張機能として使用されるときにはコンパイルされません。
// シリアルの初期化（標準ブロック相当）
serial.redirect(SerialPin.P1, SerialPin.P2, BaudRate.BaudRate115200)

// WiFi設定
wifiBoard.connectWiFi("MySSID", "MyPassword")

basic.forever(function () {
    if (wifiBoard.isConnected()) {
        // 温度を取得して表示
        let t = wifiBoard.getSensorData(wifiBoard.SensorType.T1)
        basic.showString(t)
        // 送信
        wifiBoard.sendTB()
    }
    basic.pause(10000)
})