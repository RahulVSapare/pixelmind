import { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardMedia,
  Typography,
  Container,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Avatar,
  Tooltip,
  Pagination,
  Box,
  CircularProgress,
} from "@mui/material";
import { db } from "../firebaseConfig";
import {
  doc,
  arrayRemove,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  onSnapshot,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { Favorite, FavoriteBorder, Delete } from "@mui/icons-material";

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [likedImages, setLikedImages] = useState(new Set());
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [page, setPage] = useState(1);
  const { currentUser } = useAuth();

  const imagesPerPage = 6;

  useEffect(() => {
    const fetchImages = async () => {
      const imageArray = Array.from({ length: 20 }, (_, index) => ({
        id: index + 1,
        url: `https://via.placeholder.com/200?text=Image+${index + 1}`,
        title: `Image ${index + 1}`,
      }));

      const updatedImages = [];

      // Fetch data from Firestore for each image
      for (let image of imageArray) {
        const docRef = doc(db, "images", image.id.toString());
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const imageData = docSnap.data();
          updatedImages.push({
            ...image,
            ...imageData,
          });
          // checking for current user has liked or not
          if (
            imageData.likedBy &&
            imageData.likedBy.includes(currentUser?.uid)
          ) {
            setLikedImages((prev) => new Set(prev.add(image.id)));
          }
        } else {
          await setDoc(docRef, {
            url: image.url,
            title: image.title,
            likedBy: [],
            comments: [],
          });
          updatedImages.push(image);
        }
      }

      setImages(updatedImages);
      setLoading(false);

      //updates for image from Firestore
      imageArray.forEach((image) => {
        const unsubscribe = onSnapshot(
          doc(db, "images", image.id.toString()),
          (docSnapshot) => {
            if (docSnapshot.exists()) {
              const updatedImageData = docSnapshot.data();
              setImages((prevImages) =>
                prevImages.map((img) =>
                  img.id === image.id ? { ...img, ...updatedImageData } : img
                )
              );
            }
          }
        );

        return () => unsubscribe();
      });
    };

    fetchImages();
  }, [currentUser]);

  const handleLike = async (id) => {
    if (!currentUser) {
      alert("Please login first.");
      return;
    }

    const updatedLikes = new Set(likedImages);
    const isLiked = updatedLikes.has(id);

    if (isLiked) {
      updatedLikes.delete(id);
    } else {
      updatedLikes.add(id);
    }

    setLikedImages(updatedLikes);

    const imageDocRef = doc(db, "images", id.toString());
    const docSnap = await getDoc(imageDocRef);

    if (docSnap.exists()) {
      const imageData = docSnap.data();

      const isUserAlreadyLiked = imageData.likedBy.includes(currentUser.uid);

      if (isUserAlreadyLiked) {
        await updateDoc(imageDocRef, {
          likedBy: arrayRemove(currentUser.uid), // Removing user from list for like
        });
      } else {
        await updateDoc(imageDocRef, {
          likedBy: arrayUnion(currentUser.uid), // Adding user to listfor like
        });
      }
    } else {
      console.error("Image document does not exist in Firestore");
    }
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleAddComment = async (id) => {
    if (newComment.trim() === "") return;
    const updatedImages = [...images];
    const imageIndex = updatedImages.findIndex((img) => img.id === id);

    if (imageIndex !== -1) {
      const commentData = {
        userName: currentUser.displayName || currentUser.email,
        comment: newComment,
        userId: currentUser.uid,
        timestamp: new Date(),
      };

      updatedImages[imageIndex].comments = [
        ...(updatedImages[imageIndex].comments || []),
        commentData,
      ];
      setImages(updatedImages);

      const imageDocRef = doc(db, "images", id.toString());
      const docSnap = await getDoc(imageDocRef);

      if (docSnap.exists()) {
        await updateDoc(imageDocRef, {
          comments: arrayUnion(commentData), // Adding comment to Firestore
        });
      } else {
        await setDoc(imageDocRef, {
          url: "https://via.placeholder.com/200",
          title: `Image ${id}`,
          likedBy: [],
          comments: [commentData],
        });
      }

      setNewComment("");
    }
  };

  const handleDeleteComment = async (imageId, commentId) => {
    const imageDocRef = doc(db, "images", imageId.toString());
    const imageDocSnap = await getDoc(imageDocRef);

    if (imageDocSnap.exists()) {
      const imageData = imageDocSnap.data();
      const updatedComments = imageData.comments.filter(
        (comment, index) => index !== commentId
      );

      await updateDoc(imageDocRef, {
        comments: updatedComments,
      });

      setImages((prevImages) =>
        prevImages.map((img) =>
          img.id === imageId ? { ...img, comments: updatedComments } : img
        )
      );

      if (selectedImage?.id === imageId) {
        setSelectedImage((prevSelected) => ({
          ...prevSelected,
          comments: updatedComments,
        }));
      }
    }
  };

  const handleOpenModal = (image) => {
    setSelectedImage(image);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedImage(null);
    setNewComment("");
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const startIndex = (page - 1) * imagesPerPage;
  const endIndex = page * imagesPerPage;
  const paginatedImages = images.slice(startIndex, endIndex);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box flexGrow={1} height={"0px"} overflow={"auto"} m={"1.5rem"}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          style={{ fontFamily: "Helvetica Neue" }}
          align="center"
          gutterBottom
        >
          Image Gallery
        </Typography>
        <Grid container spacing={4}>
          {paginatedImages.map((image) => (
            <Grid item xs={12} sm={6} md={4} key={image.id}>
              <Card
                sx={{
                  boxShadow: 3,
                  borderRadius: 3,
                  padding: 2,
                  transition: "transform 0.3s ease-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="300"
                  image={image.url}
                  alt={image.title || "Image"}
                  sx={{ borderRadius: 2 }}
                />
                <Typography
                  variant="h6"
                  align="center"
                  sx={{ marginTop: 1, fontFamily: "Fira Sans" }}
                >
                  {image.title}
                </Typography>
                <Divider sx={{ marginY: 2 }} />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 8,
                  }}
                >
                  <div>
                    <IconButton
                      onClick={() => handleLike(image.id)}
                      sx={{ color: likedImages.has(image.id) ? "red" : "grey" }}
                    >
                      {likedImages.has(image.id) ? (
                        <Favorite />
                      ) : (
                        <FavoriteBorder />
                      )}
                    </IconButton>
                    <Typography variant="caption" color="textSecondary">
                      {image.likedBy
                        ? `${image.likedBy.length} likes`
                        : "0 likes"}
                    </Typography>
                  </div>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleOpenModal(image)}
                  >
                    View Comments ({image.comments?.length || 0})
                  </Button>
                </div>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Pagination
          count={Math.ceil(images.length / imagesPerPage)}
          page={page}
          onChange={handleChangePage}
          sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}
        />

        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          maxWidth="md"
          fullWidth
        >
          {console.log(selectedImage)}
          <DialogTitle>{selectedImage?.title}</DialogTitle>
          <DialogContent>
            <TextField
              label="Add a comment"
              variant="outlined"
              fullWidth
              value={newComment}
              onChange={handleCommentChange}
              sx={{ marginBottom: 2 }}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleAddComment(selectedImage?.id)}
              sx={{ marginBottom: 2 }}
            >
              Add Comment
            </Button>
            <List sx={{ maxHeight: 400 }}>
              {selectedImage?.comments?.map((commentData, index) => (
                <ListItem
                  key={index}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Avatar sx={{ marginRight: 2 }}>
                    {commentData.userName?.[0].toUpperCase()}
                  </Avatar>
                  <ListItemText
                    primary={<strong>{commentData.userName}</strong>}
                    secondary={commentData.comment}
                  />
                  {commentData.userId === currentUser?.uid && (
                    <Tooltip title="Delete comment">
                      <IconButton
                        color="error"
                        onClick={() =>
                          handleDeleteComment(selectedImage.id, index)
                        }
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  )}
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default ImageGallery;
