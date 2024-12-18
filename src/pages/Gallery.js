import React from "react";
import ImageGallery from "../components/ImageGallery";
import { Box } from "@mui/material";
import Navbar from "../components/Navbar";

const Gallery = () => {
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      height={"100%"}
      width={"100%"}
      id="gallery"
    >
      <Navbar />
      <ImageGallery />
    </Box>
  );
};

export default Gallery;
