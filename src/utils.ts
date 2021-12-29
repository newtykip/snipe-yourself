export const formatSetting = (setting: string) =>
    setting
        .split('_')
        .map(s => `${s.substring(0, 1).toUpperCase()}${s.substring(1)}`)
        .join(' ');
