import { useEffect, useState } from 'react';
import { CircularProgress, Container } from '@mui/material';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../users/usersSlice';
import { Navigate } from 'react-router-dom';



const PageChat = () => {
  const [isLoading, setIsLoading] = useState(true);
  const user = useAppSelector(selectUser);

  useEffect(() => {
    setIsLoading(false);
  }, [user]);

  if (!user) {
    return <Navigate to="/register" />;
  }

  return (
    <Container>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>

        </>
      )}
    </Container>
  );
};

export default PageChat;