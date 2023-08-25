import React from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { useSelector } from 'react-redux'
import { selectIsAuth } from "../../redux/slices/auth";
import { useNavigate, Navigate, useParams } from "react-router-dom"
import axios from '../../axios';


export const AddPost = () => {
  const { id } = useParams()


  const navigate = useNavigate()
  const isAuth = useSelector(selectIsAuth)
  const [isLoading, setLoading] = React.useState(false)
  const [text, setText] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [tags, setTags] = React.useState([]);
  const [imageUrl, setimageUrl] = React.useState('');
  const inputFileRef = React.useRef()

  const isEditing = Boolean(id)

  const handleChangeFile = async (evt) => {
    try {
      const formData = new FormData();
      const file = evt.target.files[0]
      formData.append("image", file)
      const { data } = await axios.post('/upload', formData)
      setimageUrl(data.url)

    } catch (error) {
      console.warn(error);
      alert("Помилка при завантаженні файлу")
    }
    console.log(evt.target.files);

  };

  const onClickRemoveImage = () => {
    setimageUrl("")

  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);


  const onSubmit = async () => {

    try {
      setLoading(true);
      const fields = {
        title,
        tags: tags.split(','),
        text,
        imageUrl,

      }

      const { data } = isEditing ?
        await axios.patch(`/posts/${id}`, fields)
        : await axios.post('/posts', fields)
      const _id = isEditing ? id : data._id

      navigate(`/posts/${_id}`)

    } catch (error) {
      console.warn(error);
    }



  }

  React.useEffect(() => {
    if (id) {
      axios.get(`/posts/${id}`).then(({ data }) => {
        setTitle(data.title);
        setText(data.text);
        setimageUrl(data.imageUrl);
        setTags(data.tags.join(','));
      })
    }
  }, [])


  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if (!isAuth) {
    return <Navigate to='/' />
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
        Завантажити прев'ю
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Видалити
          </Button>
          <img className={styles.image} src={`process.env.REACT_APP_API_URL${imageUrl}`} alt="Uploaded" />
        </>
      )}

      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title}
        onChange={e => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Теги"
        value={tags}
        onChange={e => setTags(e.target.value)}
        fullWidth />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? "Зберегти" : "Опублікувати"}
        </Button>
        <a href="/">
          <Button size="large" >Відміна</Button>
        </a>
      </div>
    </Paper >
  );
};
