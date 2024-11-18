export class Time {
    private hours: number;
    private minutes: number;
    private seconds: number;

    constructor(hours: number, minutes: number, seconds: number = 0) {
        if (!Time.isValid(hours, minutes, seconds)) {
            throw new Error('Invalid time');
        }
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
    }

    static isValid(hours: number, minutes: number, seconds: number = 0): boolean {
        return (
            hours >= 0 && hours < 24 &&
            minutes >= 0 && minutes < 60 &&
            seconds >= 0 && seconds < 60
        );
    }

    static fromString(timeString: string): Time {
        const parts = timeString.split(':').map(Number);
        if (parts.length < 2 || parts.length > 3) {
            throw new Error('Invalid time string format');
        }
        const [hours, minutes, seconds = 0] = parts;
        if (!Time.isValid(hours, minutes, seconds)) {
            throw new Error('Invalid time');
        }
        return new Time(hours, minutes, seconds);
    }

    toString(): string {
        const pad = (num: number) => num.toString().padStart(2, '0');
        return `${pad(this.hours)}:${pad(this.minutes)}:${pad(this.seconds)}`;
    }

    addMinutes(minutesToAdd: number): Time {
        let totalMinutes = this.hours * 60 + this.minutes + minutesToAdd;
        totalMinutes %= 1440;
        if (totalMinutes < 0) totalMinutes += 1440;

        const newHours = Math.floor(totalMinutes / 60);
        const newMinutes = totalMinutes % 60;

        return new Time(newHours, newMinutes, this.seconds);
    }

    addSeconds(secondsToAdd: number): Time {
        let totalSeconds = (this.hours * 3600) + (this.minutes * 60) + this.seconds + secondsToAdd;
        totalSeconds %= 86400;
        if (totalSeconds < 0) totalSeconds += 86400;

        const newHours = Math.floor(totalSeconds / 3600);
        const newMinutes = Math.floor((totalSeconds % 3600) / 60);
        const newSeconds = totalSeconds % 60;

        return new Time(newHours, newMinutes, newSeconds);
    }

    diffInMinutes(other: Time): number {
        const thisTotalMinutes = this.hours * 60 + this.minutes;
        const otherTotalMinutes = other.hours * 60 + other.minutes;
        return thisTotalMinutes - otherTotalMinutes;
    }

    diffInSeconds(other: Time): number {
        const thisTotalSeconds = (this.hours * 3600) + (this.minutes * 60) + this.seconds;
        const otherTotalSeconds = (other.hours * 3600) + (other.minutes * 60) + other.seconds;
        return thisTotalSeconds - otherTotalSeconds;
    }
}