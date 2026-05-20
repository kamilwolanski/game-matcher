import os
import json
from gensim.models import Word2Vec

with open("scripts/ml/training-data.json", "r") as f:
    games = json.load(f)

model = Word2Vec(
    sentences=games,
    vector_size=64,
    window=4,
    min_count=1,
    sg=1,
    epochs=30
)

print(model.wv.most_similar("boomer-shooter"))
# print(model.wv.most_similar("dark-fantasy"))
# print(model.wv.most_similar("flight"))
# print(model.wv.most_similar("boomer-shooter"))
# print(model.wv.most_similar("immersive-sim"))

embeddings = {
    word: model.wv[word].tolist()
    for word in model.wv.index_to_key
}
os.makedirs("data", exist_ok=True)
with open("data/embeddings.json", "w") as f:
    json.dump(embeddings, f)

print("embeddings.json created")