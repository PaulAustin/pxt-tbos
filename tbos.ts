// Copyright (c) 2018 Trashbots, Inc.
// MIT license in LICENSE file

enum Motor {
    //% block="motor1"
    M1 = 1,
    //% block="motor2"
    M2 = 2
}

enum Servo {
    //% block="servo1"
    S1 = 1,
    //% block="servo2"
    S2 = 2,
    //% block="servo3"
    S3 = 2
}

enum Piano {
    //% weight=1
    a3 = 37,
    //% weight=2
    b3 = 39,
    //% weight=3
    c4 = 40,
    //% weight=4
    d4 = 42,
    //% weight=5
    e4 = 44,
    //% weight=6
    f4 = 45,
    //% weight=7
    g4 = 47,
    //% weight=8
    a4 = 49,  // 440 Hz
    //% weight=9
    b4 = 51,
    //% weight=10
    c5 = 52,
    //% weight=11
    d5 = 54,
}

/**
 * Custom blocks
 */
// Use font-awesome gears for icon
//% weight=100 color=#CA6F1E   icon=""
namespace tbos {

    const enum TbcSpi{
      FWVers = 1,
      SystemStop = 5,
      // Motors
      M1_power = 10,
      M1_break = 12,
      M1_encoder = 15,
      M2_power = 20,
      M2_break = 22,
      M2_encoder = 25,
      // Servos
      S1_active = 40,
      S2_active = 41,
      S3_active = 42,
      S1_position = 50,
      S2_position = 51,
      S3_position = 52,
    }

    function spiWrite2(register:number, value:number): void {
        // Send register write command to TBC
        pins.digitalWritePin(DigitalPin.P16, 0)
        pins.spiWrite(register)
        pins.spiWrite(value)
        pins.digitalWritePin(DigitalPin.P16, 1)
    }

    /**
     * Set a motor to power percentage
     * @param m motor 1 or 2
     * @param p power -100 to 100
     */
    //% block
    //% weight=60
    //% p.min=-100 v.max= 100
    export function motorPower(m: Motor, p: number): void {
        // Map motor to command register
        let mbyte = 0
        if (m === Motor.M1)
            mbyte = TbcSpi.M1_power
        else if (m === Motor.M2)
            mbyte = TbcSpi.M2_power
        else
            return  // Not a valid motor

        // Limit power range
        if (p > 100)
            p = 100
        else if (p < -100)
            p = -100

        spiWrite2(mbyte, p)
    }

    /**
     * Set motor speed
     * @param m motor 1 or 2
     * @param rpm -120.0 to 120.0
    //% block
    //% weight=59
    //% p.min=-100 v.max= 100
    export function motorSpeed(m: Motor, speed: number): void {
        // Add code here
    }
    */

    /**
     * Stop a spinning motor
     * @param m motor 1 or 2
     */
    //% block
    //% weight=58
    //% blockGap=14
    export function motorBreak(m: Motor): void {
        // Map motor to command register
        let mbyte = 0
        if (m === Motor.M1)
            mbyte = TbcSpi.M1_break
        else if (m === Motor.M2)
            mbyte = TbcSpi.M2_break
        else
            return  // Not a valid motor

        spiWrite2(mbyte, 1)
    }

    /**
     * Set a servo postion
     * @param s Servo  1, 2 or 3
     * @param position range percentage -100 to 100
    //% block
    //% weight=10
    export function servoPosition(s: Servo, pos: number): void {
        // Add code here
    }
    */

    /**
     * Set servo idle
     * @param s Servo  1, 2 or 3
     * @param idle if true.
    //% block
    //% weight=9
    export function servoIdle(s: Servo, idle: boolean): void {
        // Add code here
    }
    */

    let encBuffer = pins.createBuffer(4)

    /**
     * Read motor encoder location
     * @param m motor 1 or 2
     */
    //% weight=55
    //% block
    export function encoderAt(m: Motor): number {
        // Map motor to command register
        let mbyte = 0
        if (m === Motor.M1)
            mbyte = 0 - TbcSpi.M1_encoder
        else if (m === Motor.M2)
            mbyte = 0 - TbcSpi.M2_encoder
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
    //% weight=54
    //% block
    export function encoderSpeed(m: Motor): number {
        // Add code here
        return 0;
    }
    */

    /**
     * Clear motor encoder
     * @param m motor 1 or 2
     */
    //% weight=53
    //% block
    export function encoderClear(m: Motor): void {
        // Map motor to command register
        let mbyte = 0

        // Check motors
        if (m === Motor.M1)
            mbyte = TbcSpi.M1_encoder
        else if (m === Motor.M2)
            mbyte = TbcSpi.M2_encoder
        else
            return  // Not a valid motor

        // Send command to TBC
        spiWrite2(mbyte, 0)
    }

    /**
     * Play a piano keyboard note
     * @param n keyboard notes 1-88
     * @param b beats
     */
    //% weight=30
    //% block
    export function playNote(n: number, qb:number): void {
        // Limit note range, rest is 0
        if (n < 0)
            n = 0
        else if (n > 88)
            n = 88

        // Send command to TBC
        // Send command to TBC
        spiWrite2(mbyte, 0)
        if (qb > 0)
          basic.pause(qb * 125)
    }

    /**
     * Play a tone
     * @param f frequency 20-4000Hz
     * @param b beats
     */
    //% weight=29
    //% block
    export function playFrequency(f: number, qb:number): void {
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
        if (qb > 0)
          basic.pause(qb * 125)
    }

    /**
     * Play a tune
     * @param t tune number 1-8
    //% weight=28
    //% block
    export function playTune(t: number): void {
    }
    */

    /**
    * Set tempo
    * @param b beats per minute
    //% weight=27
    //% block
    export function playTempo(bpm: number): void {
    }
    */

    /**
    * Is a note or tune playing?
    * @returns true if playing
    //% weight=26
    //% block
    export function playing(): boolean {
        return false
    }
    */

    /**
     * Clear a tune
     * @param t tune number 1-8
    //% weight=25
    //% block
    export function tuneClear(t: number): void {
    }
    */

    /**
     * Add note to a tune
     * @param t tune number 1-8
     * @param n note 1-88
     * @param b beats
    //% weight=24
    //% block
    export function tuneNote(t: number, n: number, b: number): void {
    }
    */

    /**
    * Stop all motors, servos and sounds
    //% weight=80
    //% block
    export function stopAll(): void {
    }
    */

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
    function gyroInit(): boolean {
        gyroWriteReg(L3GD20H_RA_CTRL1, 0b00001111)
        gyroWriteReg(L3GD20H_RA_CTRL2, 0b00000000)
        gyroWriteReg(L3GD20H_RA_CTRL3, 0b00000000)
        gyroWriteReg(L3GD20H_RA_CTRL4, 0b00000000)
        gyroWriteReg(L3GD20H_RA_CTRL5, 0b00000000)
        let who = gyroReadReg(L3GD20H_RA_WHO_AM_I)
        return (who === 0b11010111)
    }

    /* Read gyro
    */
    //% weight=79
    //% block
    export function gyro(d: Dimension): number {
        switch(d) {
            case Dimension.X:
                return gyroReadRegInt16(L3GD20H_RA_OUT_X_L) / 114
            case Dimension.Y:
                return gyroReadRegInt16(L3GD20H_RA_OUT_Y_L) / 114
            case Dimension.Z:
                return gyroReadRegInt16(L3GD20H_RA_OUT_Z_L) / 114
            default:
                return 0;
        }
    }

    // Initialize the gyro if this package has been included
    gyroInit();

    /* servo positioning
    */
    //% weight=5
    //% block
    export function servoPosition(s: Servo, p: number): void {
        // Map servo to command register
        let sbyte = 0
        if (s === Servo.S1)
            sbyte = TbcSpi.S1_position
        else if (s === Servo.S2)
            sbyte = TbcSpi.S2_position
        else if (s === Servo.S3)
            sbyte = TbcSpi.S3_position
        else
            return  // Not a valid servo

        // Limit position range
        if (p > 180)
            p = 180
        else if (p < 0)
            p = 0

        // Send command to TBC
        spiWrite2(sbyte, P)
    }
}
