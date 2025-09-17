import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Modal, ModalAction } from './modal';

interface ModalConfig {
  id: string;
  type?: 'center' | 'bottom' | 'fullscreen' | 'alert' | 'confirmation';
  title?: string;
  subtitle?: string;
  content?: ReactNode;
  icon?: string;
  iconColor?: string;
  actions?: ModalAction[];
  dismissible?: boolean;
  persistent?: boolean;
  onShow?: () => void;
  onDismiss?: () => void;
}

interface ModalContextType {
  showModal: (config: Omit<ModalConfig, 'id'>) => string;
  hideModal: (id: string) => void;
  hideAllModals: () => void;
  showAlert: (title: string, message: string, actions?: ModalAction[]) => string;
  showConfirmation: (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => string;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

interface ModalProviderProps {
  children: ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [modals, setModals] = useState<ModalConfig[]>([]);

  const generateId = () => `modal_${Date.now()}_${Math.random()}`;

  const showModal = (config: Omit<ModalConfig, 'id'>): string => {
    const id = generateId();
    const newModal: ModalConfig = {
      ...config,
      id,
      dismissible: config.dismissible ?? true,
    };

    setModals(prev => [...prev, newModal]);
    return id;
  };

  const hideModal = (id: string) => {
    setModals(prev => prev.filter(modal => modal.id !== id));
  };

  const hideAllModals = () => {
    setModals([]);
  };

  const showAlert = (
    title: string,
    message: string,
    actions: ModalAction[] = [{ text: 'OK', onPress: () => {} }]
  ): string => {
    return showModal({
      type: 'alert',
      title,
      subtitle: message,
      actions: actions.map(action => ({
        ...action,
        onPress: () => {
          action.onPress();
          // Don't auto-close for custom actions
        },
      })),
      icon: 'info.circle.fill',
    });
  };

  const showConfirmation = (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ): string => {
    const modalId = generateId();
    
    return showModal({
      type: 'confirmation',
      title,
      subtitle: message,
      actions: [
        {
          text: 'Cancel',
          style: 'default',
          onPress: () => {
            onCancel?.();
            hideModal(modalId);
          },
        },
        {
          text: 'Confirm',
          style: 'primary',
          onPress: () => {
            onConfirm();
            hideModal(modalId);
          },
        },
      ],
      icon: 'questionmark.circle.fill',
      iconColor: '#f59e0b',
    });
  };

  const contextValue: ModalContextType = {
    showModal,
    hideModal,
    hideAllModals,
    showAlert,
    showConfirmation,
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      {modals.map(modal => (
        <Modal
          key={modal.id}
          visible={true}
          onClose={() => hideModal(modal.id)}
          type={modal.type}
          title={modal.title}
          subtitle={modal.subtitle}
          icon={modal.icon}
          iconColor={modal.iconColor}
          actions={modal.actions}
          dismissible={modal.dismissible}
          persistent={modal.persistent}
          onShow={modal.onShow}
          onDismiss={() => {
            modal.onDismiss?.();
            hideModal(modal.id);
          }}
        >
          {modal.content}
        </Modal>
      ))}
    </ModalContext.Provider>
  );
}

export default ModalProvider;