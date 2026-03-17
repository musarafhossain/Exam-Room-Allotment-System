export const paths = {
  root: '/',
  user: {
    root: `/users`,
    new: `/users/new`,
    edit: (id: string) => `/users/edit?id=${id}`,
    view: (id: string) => `/users/view?id=${id}`,
  },
  auth: {
    signIn: `/sign-in`,
    verify_otp: (email: string) => `/verify-otp?email=${email}`,
    signUp: `/sign-up`,
    forgotPassword: `/forgot-password`,
  },
};
