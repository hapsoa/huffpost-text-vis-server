# # top K documents retrieval
# from gensim.models.doc2vec import Doc2Vec

# queryKeywords = ['keyword1', 'keyword2']
# retrievedPostings = [0, 2, 5]

# # do cosine similarity with query_keywords and retrieved_documents

# # 1. load doc2vec model that was saved. And get vector of query_keywords
# model = Doc2Vec.load("./my_doc2vec_model")

# # 2. get vectors of retrieved_documents
# queryVector = model.infer_vector(queryKeywords)

# # 3. compute cosine similarity with vector of *query_keywords and *each vector of retrieved_documents
# model.n_similarity()
