import * as yup from 'yup';

export const emailSchema = yup.object().shape({
        email: yup
            .string()
            .email('Введите корректный адрес электронной почты')
            .required('Электронная почта обязательна для заполнения'),
    });

export const siteGroupFormSchema = yup.object().shape({
    name: yup.string().trim()
        .required("Обязательное поле")
        .min(4, "Должно быть минимум 4 символа")
        .max(256, "Превышен лимит количества символов 256"),
});

export const siteFormSchema = yup.object().shape({
    name: yup.string().trim()
        .required("Обязательное поле")
        .min(4, "Должно быть минимум 4 символа")
        .max(256, "Превышен лимит количества символов 256"),
    url: yup.string()
        .required("Обязательное поле")
        .url("Неверный формат URL"),
    siteHealthCheckInterval: yup.number().typeError("Введите числовое значение")
        .positive("Значение интервала должно быть положительным")
        .required("Обязательное поле"),
});