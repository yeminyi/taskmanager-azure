import * as fromAuth from './auth.reducer';
import {reducer} from './auth.reducer';
import * as actions from '../actions/auth.action';
import {async} from '@angular/core/testing';

describe('Test AuthReducer', () => {
  describe('Undefined Action', () => {
    it('Should return a default state', async(() => {
      const action = {} as any;
      const result = reducer(undefined, action);
      expect(result).toEqual(fromAuth.initialState);
    }));
  });

  describe('Login in successfully', () => {
    it('Should return an undefined Err  and an Auth object which user is not null', async(() => {
      const action = new actions.LoginSuccessAction({
        token: '',
        user: {
          id: '1',
          email: '123@123.com',
          password: '123456'
        }
      });
      const result = reducer(undefined, action);
      expect(result).toEqual({token: '', userId: '1'});
      expect(result.err).toBeUndefined();
    }));
  });

  describe('Login in failed', () => {
    it('Should return an Err and User which is undefined Auth object', async(() => {
      const action = new actions.LoginFailAction({
        status: 501,
        message: 'Server Error'
      });
      const result = reducer(undefined, action);
      expect(result.err).toBeDefined();
      expect(result.user).toBeUndefined();
    }));
  });

  describe('Register successfully', () => {
    it('Should return an undefined Err  and an Auth object which user is not null', async(() => {
      const action = new actions.RegisterSuccessAction({
        token: '',
        user: {
          id: '123abc',
          name: 'amy',
          email: 'amy@163.com'
        }
      });
      const result = reducer(undefined, action);
      expect(result).toEqual({token: '', userId: '123abc'});
      expect(result.err).toBeUndefined();
    }));
  });

  describe('Register failed', () => {
    it('Should return an Err and User which is undefined Auth object', async(() => {
      const action = new actions.RegisterFailAction({
        status: 501,
        message: 'Server Error'
      });
      const result = reducer(undefined, action);
      expect(result.err).toBeDefined();
      expect(result.user).toBeUndefined();
    }));
  });
});

