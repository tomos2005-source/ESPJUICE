/**
 * WiFi & Sensors Serial Board
 */
//% color="#2e7d32" weight=100 icon="\uf1eb" block="WiFi通信ボード"
//% groups='["初期化", "センサー取得", "値の一時設定", "WiFi設定", "ThingsBoard"]'
namespace wifiBoard {

    export enum SensorType {
        //% block="温度1(BME280)"
        T1,
        //% block="温度2(DS18B20)"
        T2,
        //% block="湿度"
        Hum,
        //% block="気圧"
        Pres,
        //% block="照度"
        Lux,
        //% block="距離"
        Dist
    }

    /**
     * 通信ボードとのシリアル通信を初期化します。
     */
    //% group="初期化"
    //% block="通信ボードを初期化する RX:%tx TX:%rx ボーレート:115200"
    //% tx.defl=SerialPin.P1 rx.defl=SerialPin.P2
    //% weight=100
    export function init(tx: SerialPin, rx: SerialPin): void {
        serial.redirect(tx, rx, BaudRate.BaudRate115200);
        serial.setRxBufferSize(128);
    }

    /**
     * 指定したセンサーの値を文字列で取得します。
     */
    //% group="センサー取得"
    //% block="$type の現在値を取得"
    //% weight=90
    export function getSensorData(type: SensorType): string {
        let cmd = "";
        let prefix = "";
        switch (type) {
            case SensorType.T1: cmd = "GETKIO"; prefix = "'T1"; break;
            case SensorType.T2: cmd = "GETKIO2"; prefix = "'T2"; break;
            case SensorType.Hum: cmd = "GETSHITSU"; prefix = "'H"; break;
            case SensorType.Pres: cmd = "GETKIATSU"; prefix = "'P"; break;
            case SensorType.Lux: cmd = "GETLUX"; prefix = "'L"; break;
            case SensorType.Dist: cmd = "GETDISTANCE"; prefix = "'D"; break;
        }
        serial.writeString(cmd + "\n");
        // 応答待ちの間に少し待機が必要な場合があります
        basic.pause(50);
        return serial.readUntil("\n").replace(prefix, "").trim();
    }

    /**
     * ボード上のメモリに一時的な値を保存します。
     */
    //% group="値の一時設定"
    //% block="一時的な値を設定: $type を $value にする"
    //% weight=80
    export function setTempData(type: SensorType, value: number): void {
        let cmd = "";
        switch (type) {
            case SensorType.T1: cmd = "SETKIO"; break;
            case SensorType.T2: cmd = "SETKIO2"; break;
            case SensorType.Hum: cmd = "SETSHITSU"; break;
            case SensorType.Pres: cmd = "SETKIATSU"; break;
            case SensorType.Lux: cmd = "SETLUX"; break;
            case SensorType.Dist: cmd = "SETDISTANCE"; break;
        }
        serial.writeString(cmd + " " + value + "\n");
    }

    /**
     * 指定したSSIDとパスワードでWiFiに接続します。
     */
    //% group="WiFi設定"
    //% block="WiFiに接続 SSID:$ssid パスワード:$pwd"
    //% weight=70
    export function connectWiFi(ssid: string, pwd: string): void {
        serial.writeString("APC " + ssid + " " + pwd + "\n");
    }

    /**
     * WiFiの接続状態を返します（接続済みなら真）。
     */
    //% group="WiFi設定"
    //% block="WiFi接続中？"
    //% weight=60
    export function isConnected(): boolean {
        serial.writeString("APS\n");
        basic.pause(50);
        let res = serial.readString();
        return res.includes("1");
    }

    //% group="ThingsBoard"
    //% block="ThingsBoardトークン設定 $token"
    //% weight=50
    export function setToken(token: string): void {
        serial.writeString("SETTOKEN " + token + "\n");
    }

    //% group="ThingsBoard"
    //% block="ThingsBoardへ即時送信"
    //% weight=40
    export function sendTB(): void {
        serial.writeString("SENDTB\n");
    }
}