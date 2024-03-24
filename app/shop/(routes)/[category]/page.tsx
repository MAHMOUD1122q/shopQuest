/* eslint-disable @next/next/no-img-element */
"use client";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/context";
import { toast } from "@/components/ui/use-toast";
import { useParams, useRouter } from "next/navigation";
import { Heart, Star } from "lucide-react";

export default function ProductByCategory() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [allData, setallData] = useState({} as any);
  const { setIsAuthUser, isAuthUser, cartItems, setCartItems } =
    useContext(GlobalContext);
  const { category } = useParams();

  const addToCart = async (getItem: any) => {
    const response = await fetch(`http://localhost:4000/api/auth/add-to-cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        productID: getItem._id,
        color: getItem.color[0],
        size: getItem.sizes[0],
      }),
    });
    const finalData = await response.json();
    if (finalData.success) {
      fetch("http://localhost:4000/api/auth/all-cart", {
        credentials: "include",
      }).then((response) => {
        response.json().then((data) => {
          setCartItems(data);
        });
      });
      toast({
        variant: "success",
        title: finalData.message,
      });
    } else {
      toast({
        variant: "destructive",
        title: finalData.message,
      });
    }
  };
  useEffect(() => {
    fetch(
      `http://localhost:4000/api/product/product-by-category/${category}`,
      {}
    ).then((response) => {
      response.json().then((data) => {
        setProducts(data.data);
        setallData(data);
      });
    });
  }, [category]);

  const count = allData?.ProdcutCount;

  return (
    <>
      <title>Shop</title>
      <meta />
      <div className="mt-20 ml-14">
        <div className="flex items-center">
          <h3 className=" mb-5 text-xl font-bold mx-4">All products</h3>
          <span className="text-gray-500 mb-5">({count} products)</span>
        </div>
        <div className=" flex flex-wrap">
          {products.map((product: any) => (
            <>
              <div className=" border-[1px] w-72  mx-4 cursor-pointer my-4 relative">
                {product.isSale === true ? (
                  <div className=" text-white bg-black p-2 absolute top-1 left-1 rounded-3xl font-bold ">
                    sale
                  </div>
                ) : null}
                {product.status === "Sold" ? (
                  <div className=" text-white bg-red-600 p-2 absolute top-1 left-1 rounded-3xl font-bold ">
                    sold
                  </div>
                ) : null}
                <img
                  src={product.images[0]}
                  alt="product image"
                  className="w-full h-[180px] rounded-md"
                  onClick={() => router.push(`/product/${product._id}`)}
                />
                <div
                  className=" px-6"
                  onClick={() => router.push(`/product/${product._id}`)}
                >
                  <h3 className=" mt-5">{product.name}</h3>
                  <div className=" flex mt-2">
                    <p className=" mr-2 ">
                      {" "}
                      rating : {product.rating.toFixed(1)}
                    </p>
                    <Star
                      className={product.rating >= 1 ? "text-[#ffe642]" : ""}
                      fill={product.rating >= 1 ? "#ffe642" : "#fff"}
                    />
                    <Star
                      className={product.rating >= 2 ? "text-[#ffe642]" : ""}
                      fill={product.rating >= 2 ? "#ffe642" : "#fff"}
                    />
                    <Star
                      className={product.rating >= 3 ? "text-[#ffe642]" : ""}
                      fill={product.rating >= 3 ? "#ffe642" : "#fff"}
                    />
                    <Star
                      className={product.rating >= 4 ? "text-[#ffe642]" : ""}
                      fill={product.rating >= 4 ? "#ffe642" : "#fff"}
                    />
                    <Star
                      className={product.rating === 5 ? "text-[#ffe642]" : ""}
                      fill={product.rating === 5 ? "#ffe642" : "#fff"}
                    />
                  </div>
                  <p className=" my-2">
                    price:{" "}
                    <span className=" text-slate-400 line-through ">
                      {product.price}
                    </span>{" "}
                    {product.price - product.discount} EGB
                  </p>
                </div>
                <div className=" flex justify-between mt-5 items-center  px-6 mb-5">
                  <button
                    className="text-white relative z-50 bg-sky-600 disabled:opacity-65 disabled:pointer-events-none py-2 px-10 rounded-md hover:bg-sky-700 duration-300"
                    disabled={product.status === "Sold" ? true : false}
                    onClick={() => addToCart(product)}
                  >
                    Add To Cart
                  </button>
                  <button className=" hover:text-red-600 duration-300 cursor-pointer ">
                    <Heart className=" w-8 h-8" />
                  </button>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
    </>
  );
}