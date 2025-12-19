import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';
import { fetchSliderPosts } from '../redux/sliderSlice';

const defaultPost = [
  {
    id: 1,
    image: 'https://via.placeholder.com/1200x400?text=Default+Slider+Post',
    url: '#',
  },
];

const SliderSection = () => {
  const dispatch = useDispatch();
  const { posts, status } = useSelector((state) => state.slider);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchSliderPosts());
    }
  }, [dispatch, status]);

  // Use default if posts is null or empty or missing image/url
  const slides =
    posts && Array.isArray(posts) && posts.length > 0 && posts[0].image && posts[0].url
      ? posts
      : defaultPost;

  return (
    <Box sx={{ width: '100%', overflow: 'hidden', mb: 4 }}>
      <Box sx={{ display: 'flex', width: '100%' }}>
        {slides.map((slide) => (
          <Box
            key={slide.id}
            component="a"
            href={slide.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'block',
              width: '100%',
              height: 400,
              background: '#eee',
              borderRadius: 2,
              overflow: 'hidden',
              mr: 2,
              textDecoration: 'none',
            }}
          >
            <img
              src={slide.image}
              alt="slider-post"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default SliderSection;
