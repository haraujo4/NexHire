export const maskCPF = (value: string) => {
    return value
        .replace(/\D/g, '') // Remove non-digits
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1'); // Limit to 11 digits
};

export const maskPhone = (value: string) => {
    let r = value.replace(/\D/g, "");
    if (r.length > 11) r = r.substring(0, 11);

    if (r.length > 10) {
        // (11) 99999-9999
        return r.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (r.length > 2) {
        // (11) 9999-9999
        return r.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (r.length > 0) {
        return r.replace(/^(\d{0,2})/, "($1");
    }
    return r;
};

// Simplified phone mask for better typing experience
export const formatPhone = (value: string) => {
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
    if (value.length <= 13) {
        value = value.replace(/(\d{4})(\d)/, "$1-$2");
    } else {
        value = value.replace(/(\d{5})(\d)/, "$1-$2");
    }
    return value.substring(0, 15);
};

export const maskDate = (value: string) => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d+?)$/, '$1')
        .substring(0, 10);
};

export const maskCEP = (value: string) => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{3})\d+?$/, '$1')
        .substring(0, 9);
};
