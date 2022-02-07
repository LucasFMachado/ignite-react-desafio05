import { useState } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Prismic from '@prismicio/client';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { getPrismicClient } from '../services/prismic';

import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const { results, next_page } = postsPagination;
  const [posts, setPosts] = useState(results);
  const [nextPage, setNextPage] = useState(next_page);

  function handleGetNewPosts(): void {
    fetch(nextPage)
      .then(res => res.json())
      .then(jsonPosts => {
        const newPosts = jsonPosts.results.map(post => ({
          uid: post.uid,
          first_publication_date: post.first_publication_date,
          data: post.data,
        }));
        setPosts(oldPosts => [...oldPosts, ...newPosts]);
        setNextPage(jsonPosts.next_page);
      });
  }

  return (
    <>
      <Head>
        <title>spacetraveling</title>
      </Head>
      <main className={styles.postContainer}>
        <div className={styles.postList}>
          {posts.map(post => (
            <Link key={post.uid} href={`/post/${post.uid}`}>
              <a>
                <strong>{post.data.title}</strong>
                <p>{post.data.subtitle}</p>

                <div className={styles.postInfo}>
                  <time>
                    <FiCalendar />
                    {format(
                      new Date(post.first_publication_date),
                      'dd MMM yyyy',
                      {
                        locale: ptBR,
                      }
                    )}
                  </time>
                  <span>
                    <FiUser />
                    {post.data.author}
                  </span>
                </div>
              </a>
            </Link>
          ))}
        </div>
        {nextPage && (
          <button type="button" onClick={() => handleGetNewPosts()}>
            Carregar mais posts
          </button>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      pageSize: 2,
    }
  );

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: post.data,
    };
  });

  return {
    props: {
      postsPagination: {
        results: posts,
        next_page: postsResponse.next_page,
      },
    },
  };
};
