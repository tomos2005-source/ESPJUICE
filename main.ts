/**
 * WiFi & Sensors Serial Board Control
 * ※シリアルの初期化（ピン設定・ボーレート115200）は
 * 標準の「シリアル通信をリダイレクトする」ブロックで行ってください。
 */
//% color="#2e7d32" weight=100 icon="\uf1eb" block="WiFi通信ボード"
//% groups='["センサー取得", "値の一時設定", "WiFi設定", "ThingsBoard"]'
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
     * 指定したセンサーの値を文字列で取得します。
     */
    //% group="センサー取得"
    //% block="$type の現在値を取得"
    //% weight=100
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
        serial.writeLine(cmd);
        basic.pause(100); // 応答待ちの安定化
        return serial.readUntil("\n").replace(prefix, "").trim();
    }

    /**
     * ボード上のメモリに一時的な値を保存します。
     */
    //% group="値の一時設定"
    //% block="一時的な値を設定: $type を $value にする"
    //% weight=90
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
        serial.writeLine(cmd + " " + value);
    }

    /**
     * SSIDとパスワードを一時記憶してWiFiに接続します。
     */
    //% group="WiFi設定"
    //% block="WiFiに接続 SSID:$ssid パスワード:$pwd"
    //% weight=80
    export function connectWiFi(ssid: string, pwd: string): void {
        serial.writeLine("APC " + ssid + " " + pwd);
    }

    /**
     * WiFiの接続状態を確認します（1=接続済, 0=未接続）。
     */
    //% group="WiFi設定"
    //% block="WiFi接続状態を確認"
    //% weight=70
    export function isConnected(): boolean {
        serial.writeLine("APS");
        basic.pause(50);
        let res = serial.readString();
        return res.includes("1");
    }

    /**
     * WiFiを切断し、自動送信を停止します。
     */
    //% group="WiFi設定"
    //% block="WiFiを切断"
    //% weight=60
    export function disconnectWiFi(): void {
        serial.writeLine("APD");
    }

    /**
     * ThingsBoardのアクセストークンを設定します。
     */
    //% group="ThingsBoard"
    //% block="ThingsBoardトークン設定 $token"
    //% weight=50
    export function setToken(token: string): void {
        serial.writeLine("SETTOKEN " + token);
    }

    /**
     * 現在のセンサー値をThingsBoardに即時送信します。
     */
    //% group="ThingsBoard"
    //% block="ThingsBoardへ即時送信"
    //% weight=40
    export function sendTB(): void {
        serial.writeLine("SENDTB");
    }

    /**
     * 指定した秒数間隔で、ThingsBoardへの自動送信を開始します（0で停止）。
     */
    //% group="ThingsBoard"
    //% block="ThingsBoardへ $sec 秒間隔で自動送信"
    //% weight=30
    export function autoSendTB(sec: number): void {
        serial.writeLine("SENDTB " + sec);
    }
}