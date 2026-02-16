import { useEffect, useRef, useState } from 'react';
import toast, { Toast, ToastPosition } from 'react-hot-toast';

interface UseToastStackOptions {
  position?: ToastPosition;
  duration?: number;
  [key: string]: any;
}

interface ShowStackedToastProps {
  [key: string]: any;
}

export const useToastStack = () => {
  const [activeToastIds, setActiveToastIds] = useState<string[]>([]);
  const activeToastIdsRef = useRef<string[]>(activeToastIds);

  // for Keeping the ref in sync with state
  useEffect(() => {
    activeToastIdsRef.current = activeToastIds;
  }, [activeToastIds]);

  const handleDismiss = (id: string) => {
    toast.dismiss(id);
    setActiveToastIds(prevIds => prevIds.filter(toastId => toastId !== id));
  };

  const showStackedToast = (
    CustomToastComponent: React.FC<any>,
    props: ShowStackedToastProps,
    options: UseToastStackOptions = {}
  ) => {
    // Dismiss any existing toasts to prevent the stack from getting too large
    if (activeToastIdsRef.current.length >= 3) {
      toast.dismiss(
        activeToastIdsRef.current[activeToastIdsRef.current.length - 1]
      );
    }

    const newToastId = toast.custom(
      (t: Toast) => {
        const index = activeToastIdsRef.current.findIndex(id => id === t.id);
        const stackIndex =
          index !== -1 ? index : activeToastIdsRef.current.length;
        const Component = CustomToastComponent;
        return (
          <Component
            {...props}
            t={t}
            stackIndex={stackIndex}
            onDismiss={() => handleDismiss(t.id)}
          />
        );
      },
      {
        ...options,
        position: 'bottom-right',
      }
    );

    setActiveToastIds(prevIds => [newToastId, ...prevIds]);

    return newToastId;
  };

  // Clean up toasts when the component unmounts
  useEffect(() => {
    return () => {
      activeToastIdsRef.current.forEach(id => toast.dismiss(id));
    };
  }, []);

  return { showStackedToast };
};
