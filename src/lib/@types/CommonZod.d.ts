import z4 from 'zod/v4';

export const Email = z4.string().email();
export const EmailArray = z4.array(Email);
export const EmailOrEmailArray = z4.union([Email, EmailArray]);

export const PhoneNumber = z4.string().regex(/^\+[1-9]\d{1,14}$/);
export const PhoneNumberArray = z4.array(PhoneNumber);
export const PhoneNumberOrPhoneNumberArray = z4.union([PhoneNumber, PhoneNumberArray]);

export const URL = z4.string().url();
export const URLArray = z4.array(URL);
export const URLOrURLArray = z4.union([URL, URLArray]);

export const UUID = z4.string().uuid();
export const UUIDArray = z4.array(UUID);
export const UUIDOrUUIDArray = z4.union([UUID, UUIDArray]);

export const Date = z4.date();
export const DateArray = z4.array(Date);
export const DateOrDateArray = z4.union([Date, DateArray]);

export const DateTime = z4.date();
export const DateTimeArray = z4.array(DateTime);
export const DateTimeOrDateTimeArray = z4.union([DateTime, DateTimeArray]);
