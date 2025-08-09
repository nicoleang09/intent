import { scheduleData } from './Schedules';
import { taskData } from './Tasks';
import { TaskMap } from './Types';

export interface AppSession {
  token?: string;
  username?: string;
}

export const getSession = (): AppSession => {
  const session = sessionStorage.getItem('intentSession');

  if (!session) {
    return {};
  }

  return JSON.parse(session);
};

export const getSessionToken = (): string | undefined => {
  const session = getSession();
  return session.token;
};

export const getSessionUsername = (): string | undefined => {
  const session = getSession();
  return session.username;
};

export const setSession = (session: AppSession): void => {
  sessionStorage.setItem('intentSession', JSON.stringify(session));
};
