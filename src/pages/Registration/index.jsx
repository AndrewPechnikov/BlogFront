import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from "react-router-dom"
import { fetchAuth, fetchRegistr, selectIsAuth } from "../../redux/slices/auth";

import styles from './Login.module.scss';

export const Registration = () => {

  const isAuth = useSelector(selectIsAuth)

  const dispatch = useDispatch()

  const { register, handleSubmit, setError, formState: { errors, isValid }
  } = useForm({
    defaultValues: {
      fullName: "Андрій Печніков",
      email: "Andrew@mail.ua",
      password: "1235",
    },
    mode: "onChange"
  })

  React.useEffect(() => { }, []);

  const onSubmit = async (values) => {
    const data = await dispatch(fetchRegistr(values));
    if (data.payload && "token" in data.payload) {
      window.localStorage.setItem('token', data.payload.token)
    }
    else {
      alert("Не вдалось зареєструватись")
    }
  }

  if (isAuth) {
    return <Navigate to='/' />
  }


  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Створення акаунту
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>

        <TextField className={styles.field} label="Ім'я"
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          {...register("fullName", { required: "Вкажіть ім'я" })}
          fullWidth />

        <TextField
          className={styles.field}
          label="E-Mail"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register("email", { required: "Вкажіть пошту" })}
          fullWidth
        />
        <TextField className={styles.field} label="Пароль"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register("password", { required: "Вкажіть пароль" })}
          fullWidth />


        <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
          Зареєструватись
        </Button>
      </form>
    </Paper>
  );
};
