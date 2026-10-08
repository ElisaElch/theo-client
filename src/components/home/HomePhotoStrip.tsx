import photo1 from "../../assets/home-strip-1.webp";
import photo2 from "../../assets/home-strip-2.webp";
import photo3 from "../../assets/home-strip-3.webp";
import photo4 from "../../assets/home-strip-4.webp";

// The four photos, left to right. To swap one, replace the file in src/assets
// with a new photo of the same name. Handwritten notes can be added here later.
// focus = which part of the photo to keep when it's cropped to fit the tile
const PHOTOS = [
  { src: photo1, focus: "object-center" },
  { src: photo2, focus: "object-center" },
  { src: photo3, focus: "object-top" }, // keep the coffee and the top of the plate
    { src: photo4, focus: "object-[center_70%]" }, // a bit below centre, to keep the huts
];

// A row of four photos between the features and the closing band
// (two by two on phones and tablets)
function HomePhotoStrip() {
  return (
    <section className="grid grid-cols-2 gap-5 lg:grid-cols-4">
      {PHOTOS.map(({ src, focus }) => (
        <img
          key={src}
          src={src}
          alt=""
          className={`aspect-[4/3] w-full rounded-2xl object-cover opacity-90 ${focus}`}
        />
      ))}
    </section>
  );
}

export default HomePhotoStrip;