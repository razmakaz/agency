export const TextRegex = ({
	min = 0,
	max = 256
}: {
	min?: number;
	max?: number;
	regex?: RegExp;
}) => {
	return new RegExp(`^[a-zA-Z0-9\\s]{${min},${max}}$`);
};

export const ITINRegex = /^\d{3}-\d{2}-\d{4}$/;
export const EINRegex = /^\d{2}-\d{7}$/;

export const PhoneRegex = /^\+?[1-9]\d{1,14}$/;
export const EmailRegex = /^[a-zA-Z0-9._%+-]{1,}@[a-zA-Z0-9.-]{1,}\.[a-zA-Z]{2,}$/;
