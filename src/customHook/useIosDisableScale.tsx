import React, {useEffect} from 'react';

export const useDisableIosScale = () => {

    useEffect(() => {
        let lastTouchEnd = 0;

        const touchstart = (event: TouchEvent) => {
            if (event.changedTouches.length > 1) {
                event.preventDefault();
            }
        }

        const touchEnd = (event: TouchEvent) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }

        const gesturestart = (event: TouchEvent) => {
            event.preventDefault();
        }

        document.addEventListener('touchstart', touchstart);
        document.addEventListener('touchend', touchEnd, false);
        document.addEventListener('gesturestart', gesturestart);

        return () => {
            lastTouchEnd = 0
            document.removeEventListener('touchstart', touchstart);
            document.removeEventListener('touchend', touchEnd, false);
            document.removeEventListener('gesturestart', gesturestart);
        }
    }, [])
}