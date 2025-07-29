import ProductCard from '../src/components/productCard.jsx';

export default function HomePage() {
  return (
    <div className="home-page">
      <h1>Welcome to Crystal Bloom</h1>
      <p>Your one-stop shop for beauty products!</p>
      <ProductCard
        name="Lipstick"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae ab praesentium qui quam ducimus cum sit dignissimos beatae omnis fugit!"
        price="1000/="
        picture="https://png.pngtree.com/png-vector/20221014/ourmid/pngtree-3dc4d-stereo-lipstick-png-image_6150416.png"
      />
      <ProductCard
        name="Eyeliner"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae ab praesentium qui quam ducimus cum sit dignissimos beatae omnis fugit!"
        price="2000/="
        picture="https://www.laurenbrookecosmetiques.com/cdn/shop/files/Liquid_Eyeliner_2024_sm.png?v=1743546015"
      />
    </div>
  );
}