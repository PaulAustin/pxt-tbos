// Copyright (c) 2018 Trashbots, Inc.
// MIT license in LICENSE file

enum Motors {
    //% block="motor1"
    M1 = 1,
    //% block="motor2"
    M2 = 2
}

enum Servos {
    //% block="servo1"
    S1 = 1,
    //% block="servo2"
    S2 = 2,
    //% block="servo3"
    S3 = 2
}

enum Piano {
    //% block="servo1"
    A4 = 48,
    //% block="servo2"
    B4 = 50,
    //% block="servo3"
    C4 = 51,
    //% block="servo3"
    D4 = 53,
    //% block="servo3"
    E4 = 55,
    //% block="servo3"
    F4 = 56,
    //% block="servo3"
    G4 = 58
}

/**
 * Custom blocks
 */
// Use forn-awesome gears for icon
//% weight=100 color=#CA6F1E   icon=""
namespace tbos {
    /**
     * Set a motor to power percentage
     * @param m motor 1 or 2
     * @param p power -100 to 100
     */
    //% weight=60
    //% block
    export function motorPower(m: Motors, p: number): void {
        let mbyte = 0

        // Check motors
        if (m === Motors.M1)
            mbyte = 10
        else if (m === Motors.M2)
            mbyte = 20
        else
            return  // Not a valid motor

        // Limit power range
        if (p > 100)
            p = 100
        else if (p < -100)
            p = -100

        // Send command to TBC
        pins.digitalWritePin(DigitalPin.P16, 0)
        pins.spiWrite(mbyte)
        pins.spiWrite(p)
        pins.digitalWritePin(DigitalPin.P16, 1)
    }

    /**
     * Set motor speed
     * @param m motor 1 or 2
     * @param rpm -120.0 to 120.0
     */
    //% weight=59
    //% block
    export function motorSpeed(m: Motors, speed: number): void {
        // Add code here
    }

    /**
     * Stop a spinning motor
     * @param m motor 1 or 2
     */
    //% weight=58
    //% block
    export function motorBreak(m: Motors): void {
        // Add code here
    }

    /**
     * Set a servo postion
     * @param s Servo  1, 2 or 3
     * @param position range percentage -100 to 100
     */
    //% block
    export function servoPosition(s: Servos, pos: number): void {
        // Add code here
    }

    /**
     * Set servo idle
     * @param s Servo  1, 2 or 3
     * @param idle if true.\
     */
    //% block
    export function servoIdle(s: Servos, idle: boolean): void {
        // Add code here
    }

    let encBuffer = pins.createBuffer(4)

    /**
     * Read motor encoder location
     * @param m motor 1 or 2
     */
    //% weight=55
    //% block
    export function encoderAt(m: Motors): number {
        let mbyte = 0
        if (m === Motors.M1)
            mbyte = -15
        else if (m === Motors.M1)
            mbyte = -25
        else
            return 0  // no such encoder

        pins.digitalWritePin(DigitalPin.P16, 0)
        pins.spiWrite(mbyte)
        encBuffer.setNumber(NumberFormat.Int8LE, 0, pins.spiWrite(3))
        encBuffer.setNumber(NumberFormat.Int8LE, 1, pins.spiWrite(2))
        encBuffer.setNumber(NumberFormat.Int8LE, 2, pins.spiWrite(1))
        encBuffer.setNumber(NumberFormat.Int8LE, 3, pins.spiWrite(0))
        pins.digitalWritePin(DigitalPin.P16, 1)
        return encBuffer.getNumber(NumberFormat.Int32LE, 0)
    }

    /**
     * Read motor encoder speed (RPM)
     * @param m motor 1 or 2
     */
    //% weight=54
    //% block
    export function encoderSpeed(m: Motors): number {
        // Add code here
        return 0;
    }

    /**
     * Clear motor encoder
     * @param m motor 1 or 2
     */
    //% weight=53
    //% block
    export function encoderClear(m: Motors): number {
        // Add code here
        return 0;
    }

    /**
     * Play a piano keyboard note
     * @param n keyboard notes 1-88
     * @param b beats
     */
    //% weight=30
    //% block
    export function playNote(n: number, b: number): void {
        // Limit note range, rest is 0
        if (n < 0)
            n = 0
        else if (n > 88)
            n = 88

        // Send command to TBC
        pins.digitalWritePin(DigitalPin.P16, 0)
        pins.spiWrite(62)
        pins.spiWrite(n)
        pins.digitalWritePin(DigitalPin.P16, 1)
    }

    /**
     * Play a tone
     * @param f frequency 20-4000Hz
     * @param b beats
     */
    //% weight=29
    //% block
    export function playFrequency(f: number, b: number): void {
        // Limit note range, rest is 0
        if (f < 0)
            f = 0
        else if (f > 4000)
            f = 4000

        // Send command to TBC
        pins.digitalWritePin(DigitalPin.P16, 0)
        pins.spiWrite(63)
        pins.spiWrite(116)
        pins.spiWrite(f & 0x0000ff00) >> 8
        pins.spiWrite(f & 0x000000ff)
        pins.digitalWritePin(DigitalPin.P16, 1)
    }

    /**
     * Play a tune
     * @param t tune number 1-8
     */
    //% weight=28
    //% block
    export function playTune(t: number): void {
    }

    /**
    * Set tempo
    * @param b beats per minute
    */
    //% weight=27
    //% block
    export function playTempo(bpm: number): void {
    }

    /**
    * Is a note or tune playing?
    * @returns true if playing
    */
    //% weight=26
    //% block
    export function playing(): boolean {
        return false
    }

    /**
     * Clear a tune
     * @param t tune number 1-8
     */
    //% weight=25
    //% block
    export function tuneClear(t: number): void {
    }

    /**
     * Add note to a tune
     * @param t tune number 1-8
     * @param n note 1-88
     * @param b beats
     */
    //% weight=24
    //% block
    export function tuneNote(t: number, n: number, b: number): void {
    }

    /**
    * Stop all motors, servos and sounds
    */
    //% weight=80
    //% block
    export function stopAll(): void {
    }

    // Registers for L3GD20H (not exported from package)
    let L3GD20H_ADDR = 0x6B
    let L3GD20H_RA_WHO_AM_I = 0x0F
    let L3GD20H_RA_CTRL1 = 0x20
    let L3GD20H_RA_CTRL2 = 0x21
    let L3GD20H_RA_CTRL3 = 0x22
    let L3GD20H_RA_CTRL4 = 0x23
    let L3GD20H_RA_CTRL5 = 0x24
    let L3GD20H_RA_OUT_X_L = 0x28
    let L3GD20H_RA_OUT_X_H = 0x29
    let L3GD20H_RA_OUT_Y_L = 0x2A
    let L3GD20H_RA_OUT_Y_H = 0x2B
    let L3GD20H_RA_OUT_Z_L = 0x2C
    let L3GD20H_RA_OUT_Z_H = 0x2D

    let gyroBuffer = pins.createBuffer(2)
    function gyroWriteReg(reg: number, val: number) {
        gyroBuffer.setNumber(NumberFormat.Int8LE, 0, reg)
        gyroBuffer.setNumber(NumberFormat.Int8LE, 1, val)
        pins.i2cWriteBuffer(L3GD20H_ADDR, gyroBuffer)
    }

    function gyroReadReg(reg: number) {
        pins.i2cWriteNumber(L3GD20H_ADDR, reg, NumberFormat.Int8LE, false)
        return pins.i2cReadNumber(L3GD20H_ADDR, NumberFormat.UInt8BE, false)
    }

    function gyroReadRegInt16(reg: number) {
        let l = gyroReadReg(reg)
        let h = gyroReadReg(reg + 1)
        gyroBuffer.setNumber(NumberFormat.Int8LE, 0, h)
        gyroBuffer.setNumber(NumberFormat.Int8LE, 1, l)
        return gyroBuffer.getNumber(NumberFormat.Int16BE, 0)
    }

    /* Initialize the Gyro (set sensitivity) *
    */
    //% block
    export function gyroInit(): boolean {
        gyroWriteReg(L3GD20H_RA_CTRL1, 0b00001111)
        gyroWriteReg(L3GD20H_RA_CTRL2, 0b00000000)
        gyroWriteReg(L3GD20H_RA_CTRL3, 0b00000000)
        gyroWriteReg(L3GD20H_RA_CTRL4, 0b00000000)
        gyroWriteReg(L3GD20H_RA_CTRL5, 0b00000000)
        let who = gyroReadReg(L3GD20H_RA_WHO_AM_I)
        return (who === 0b11010111)
    }

    /* Read gyro x
    */
    //% weight=79
    //% block
    export function gyroX(): number {
        let x = gyroReadRegInt16(L3GD20H_RA_OUT_X_L)
        return x / 114  // convert to degrees per second
    }

    /* Read gyro y
    */
    //% weight=78
    //% block
    export function gyroY(): number {
        let y = gyroReadRegInt16(L3GD20H_RA_OUT_Y_L)
        return y / 114  // convert to degrees per second
    }

    /* Read gyro z
    */
    //% weight=77
    //% block
    export function gyroZ(): number {
        let z = gyroReadRegInt16(L3GD20H_RA_OUT_Z_L)
        return z / 114  // convert to degrees per second
    }
}
