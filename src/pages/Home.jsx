import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import axios from "../axios"

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { fetchPosts, fetchTags } from '../redux/slices/posts';


export const Home = () => {
  const dispatch = useDispatch()
  const { posts, tags } = useSelector(state => state.posts)
  const userData = useSelector(state => state.auth.data)

  const isPostLoading = posts.status === "Loading"
  const isTagsLoading = tags.status === "Loading"

  React.useEffect(() => {
    dispatch(fetchPosts())
    dispatch(fetchTags())
  }, [])


  return (
    <>
      <Tabs style={{ marginBottom: 15 }} value={0} aria-label="basic tabs example">
        <Tab label="Нове" />
        <Tab label="Популярне" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostLoading ? [...Array(5)] : posts.items).map((obj, index) => isPostLoading ?
            (<Post key={index} isLoading={true} />)
            :
            <Post
              id={obj._id}
              title={obj.title}
              imageUrl={obj.imageUrl ? `https://mern-pet-blog.onrender.com/${obj.imageUrl}` : ""}
              user={obj.user}
              createdAt={obj.createdAt}
              viewsCount={obj.viewsCount}
              commentsCount={3}
              tags={obj.tags}
              // isEditable
              isEditable={userData?._id === obj.user._id}
            />
          )

          }
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: 'Василь Пупкін',
                  avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                },
                text: 'Тест текстового коментаря',
              },
              {
                user: {
                  fullName: 'Іван Іванов',
                  avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                },
                text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
