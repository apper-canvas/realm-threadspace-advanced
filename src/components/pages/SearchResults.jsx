import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { PostService } from '@/services/api/postService';
import { CommunityService } from '@/services/api/communityService';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import Error from '@/components/ui/Error';
import PostCard from '@/components/organisms/PostCard';
import { cn } from '@/utils/cn';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [postResults, setPostResults] = useState([]);
  const [communityResults, setCommunityResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setPostResults([]);
        setCommunityResults([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [posts, communities] = await Promise.all([
          PostService.search(query),
          CommunityService.search(query)
        ]);

        setPostResults(posts);
        setCommunityResults(communities);
      } catch (err) {
        console.error('Search failed:', err);
        setError('Failed to perform search. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query]);

  const handleVote = async (postId, voteValue) => {
    try {
      await PostService.vote(postId, voteValue);
      const updatedPosts = await PostService.search(query);
      setPostResults(updatedPosts);
    } catch (err) {
      console.error('Vote failed:', err);
    }
  };

  if (loading) {
    return <Loading message="Searching..." />;
  }

  if (error) {
    return <Error message={error} />;
  }

  if (!query.trim()) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <ApperIcon name="Search" size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Enter a search query
          </h2>
          <p className="text-gray-600">
            Use the search bar above to find posts and communities
          </p>
        </div>
      </div>
    );
  }

  const totalResults = postResults.length + communityResults.length;

  if (totalResults === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Search Results for "{query}"
          </h1>
          <p className="text-gray-600">No results found</p>
        </div>
        <Empty
          icon="Search"
          title="No matches found"
          description={`We couldn't find any posts or communities matching "${query}". Try different keywords.`}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Search Results for "{query}"
        </h1>
        <p className="text-gray-600">
          Found {totalResults} result{totalResults !== 1 ? 's' : ''}
        </p>
      </div>

      {communityResults.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ApperIcon name="Users" size={24} />
            Communities ({communityResults.length})
          </h2>
          <div className="space-y-3">
            {communityResults.map((result) => (
              <Link
                key={result.community.name}
                to={`/community/${result.community.name}`}
                className="block bg-white rounded-lg border border-gray-200 p-4 hover:border-accent hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <ApperIcon name="Users" size={24} className="text-accent" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        r/{result.community.name}
                      </h3>
                      <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                        {result.community.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {result.community.memberCount.toLocaleString()} members
                    </p>
                    {result.snippet && (
                      <p className="text-sm text-gray-700 line-clamp-2">
                        ...{result.snippet}...
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {postResults.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ApperIcon name="FileText" size={24} />
            Posts ({postResults.length})
          </h2>
          <div className="space-y-4">
            {postResults.map((result) => (
              <div key={result.post.Id} className="bg-white rounded-lg border border-gray-200">
                <PostCard post={result.post} onVote={handleVote} />
                {result.snippet && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600 mt-3">
                      <span className="font-medium text-gray-700">Match: </span>
                      ...{result.snippet}...
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default SearchResults;