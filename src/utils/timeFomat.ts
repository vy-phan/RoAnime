export const formatTime = (time?: string) => {
    return time ? time.replace(' phút/tập', 'p').replace(' phút', 'p') : '';
}; 