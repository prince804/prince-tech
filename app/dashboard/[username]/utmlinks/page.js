"use client"
import Header from '@/app/components/header';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function UTMLinks() {
  const params = useParams();
  const [username, setUsername] = useState('');
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [utmLinks, setUtmLinks] = useState([]);
  const [copiedIndexes, setCopiedIndexes] = useState([]);
  const [fetchingPosts, setFetchingPosts] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && params?.username) {
      setUsername(params.username);
    }
  }, [params?.username]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      categories.map(category => updateDB(category.categoryId));
    }
  }, [categories]);

  useEffect(() => {
    setUtmLinks([]);
    setCopiedIndexes([]);
  }, [selectedCategory])


  useEffect(() => {
    if (posts.length > 0 && username) {
      const updatedLinks = posts.map((item) => {
        item.link = item.link.split("?utm_campaign")[0];
        if (item.link.endsWith("/")) { item.link = item.link.slice(0, -1); }
        let newLink = break_address(item.link);
        if (newLink) {
          return {
            link: `${item.link}?utm_campaign=${newLink.title}_${username}&utm_medium=link&utm_source=link_${username}`,
            title: item.title
          };
        }
        return item.link;
      });
      setUtmLinks(updatedLinks);
    }
  }, [posts, username]);

  // Function to fetch categories
  async function fetchCategories() {
    try {
      setFetchingPosts(true);
      const response = await fetch('/api/categories'); // Make sure the GET route is at /api/getCategories
      const data = await response.json();
      setFetchingPosts(false);
      setCategories(data);
      console.log("All Categories are Updated")

      //Updating Categories
      console.log(`Updating Categories in DB.....`)
      const reqCat = await fetch("/api/categories",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        });
      const catRes = await reqCat.json();
      console.log(catRes.message);
    } catch (error) {
      console.log(error);
    }
  }
  async function updateDB(categoryId) {
    try {
      //Updating Links
      console.log(`Updating Links for ${categoryId}.....`)
      const reqPosts = await fetch("/api/posts",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ categoryId: categoryId })
        });
      const postsRes = await reqPosts.json();
      console.log(postsRes.message);
    } catch (error) {
      console.log(error);
    }
  }

  // Handle category change
  const handleCategoryChange = async (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    // Find the selected category and its posts
    const selectedCat = categories.find(category => category.categoryId === parseInt(categoryId));
    if (selectedCat) {
      setPosts(selectedCat.posts);
    } else {
      setPosts([]);
    }
  };


  // Utility to break the address into components
  function break_address(url_add) {
    const data = url_add.split("://");
    const protocol = data[0];
    const domainData = data[1].split(".com");
    const domain = domainData[0];
    const pathData = domainData[1].split("/");
    const title = pathData[1].split("-").slice(0, 3).join("-");

    return {
      protocol: protocol,
      domain: domain,
      title: title,
    };
  }

  function decode(str) {
    return str.replace(/(&#(\d+);)/g, function (match, capture, charCode) {
      return String.fromCharCode(charCode);
    });
  }

  const copy = (text, index) => {
    navigator.clipboard.writeText(text)
    toast('Copied to Clipboard!', {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    if (!copiedIndexes.includes(index)) {
      setCopiedIndexes([...copiedIndexes, index]);
    }
  }

  // Prevent rendering until username is available
  if (!username) {
    return (
      <div role="status" className="w-screen h-screen flex justify-center items-center">
        <svg aria-hidden="true" className="inline w-20 h-20 animate-spin text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
        </svg>
      </div>
    );
  }

  return (
    <>
      <Header />
      <h1 className='font-bold text-5xl text-white text-center m-4'>Latest Articles Links</h1>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-[80vw] mx-auto my-4">
        <table className="w-full text-sm text-left rtl:text-right text-gray-400">
          <caption className="p-5 text-lg font-semibold text-left rtl:text-right text-white bg-gray-800">
            {fetchingPosts &&
              <div className="w-full flex justify-center items-center">
                <svg aria-hidden="true" className="w-10 h-10 animate-spin text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
              </div>
            }
            {!fetchingPosts &&
              <select className='w-full h-10 rounded-lg bg-gray-700 px-4' onChange={handleCategoryChange}>
                <option className='rounded-full' value={""}>Select a Category</option>
                {categories.map((category) => {
                  return (<option key={category.categoryId} className='rounded-full' value={category.categoryId}>{category.name}</option>)
                })}
              </select>
            }

          </caption>
          <thead className="text-xs uppercase bg-gray-700 text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">#</th>
              <th scope="col" className="px-6 py-3">Links</th>
            </tr>
          </thead>
          <tbody>
            {utmLinks.length > 0 && utmLinks.map((item, index) => {
              const isCopied = copiedIndexes.includes(index);
              return (
                <tr key={index} className={`cursor-pointer border-b bg-gray-800 border-gray-700 ${isCopied ? 'bg-gray-700 text-gray-600' : 'bg-gray-800 text-gray-900 hover:bg-gray-600'}`}>
                  <th scope="row" className={`w-6 px-6 py-4 font-medium whitespace-nowrap ${isCopied ? 'text-gray-600' : 'text-white'}`}>{index + 1}</th>
                  <td className={`px-6 py-4 font-medium ${isCopied ? 'text-gray-600' : 'text-blue-500 hover:underline'}`} onClick={() => { copy(item.link, index) }}>
                    <p className="">
                      {decode(item.title)}
                    </p>
                  </td>
                </tr>
              )
            })}
            {(utmLinks.length <= 0) &&
              <tr className="cursor-pointer border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                <th scope="row" className="w-6 px-6 py-4 font-medium whitespace-nowrap text-white">0</th>
                <td className="px-6 py-4">
                  <p className="font-medium text-white text-center">
                    No Links to Display!
                  </p>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </>
  );
}
