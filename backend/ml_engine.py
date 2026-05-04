from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import numpy as np

# A very simple mock dataset for initialization
TRAIN_DATA = [
    "water leaking from pipe on main street",
    "garbage bin is overflowing and smells bad",
    "street light is broken since a week",
    "pothole on the road causing accidents",
    "no electricity in the entire neighborhood",
    "urgent: huge water pipeline burst, flooding the area",
    "emergency: live wire fallen on the street",
    "road is slightly damaged",
    "small water leak"
]

TRAIN_LABELS = [
    "Medium",
    "Medium",
    "Low",
    "High",
    "High",
    "High",
    "High",
    "Low",
    "Low"
]

class PriorityPredictor:
    def __init__(self):
        self.pipeline = Pipeline([
            ('tfidf', TfidfVectorizer(stop_words='english')),
            ('clf', LogisticRegression(random_state=42, max_iter=1000))
        ])
        self.train_model()

    def train_model(self):
        # In a real scenario, this would load a pre-trained model or train on a larger DB
        self.pipeline.fit(TRAIN_DATA, TRAIN_LABELS)

    def predict_priority(self, text: str, category: str):
        # 1. Base ML Prediction
        combined_text = f"{category} {text}"
        probas = self.pipeline.predict_proba([combined_text])[0]
        classes = self.pipeline.classes_
        
        best_class_idx = np.argmax(probas)
        predicted_priority = classes[best_class_idx]
        confidence = probas[best_class_idx]

        # 2. Rule-based override based on category
        category_lower = category.lower()
        
        if category_lower in ['electricity', 'water']:
            predicted_priority = 'High'
            # Boost confidence since this is a strict rule
            confidence = min(1.0, confidence + 0.4)
        elif category_lower == 'road':
            predicted_priority = 'Low'
            confidence = min(1.0, confidence + 0.3)
        else:
            # Other categories (garbage, other) must be Medium or Low
            if predicted_priority == 'High':
                predicted_priority = 'Medium'
                
            # We can still apply urgent keywords, but cap them at Medium for non-critical categories
            text_lower = combined_text.lower()
            high_priority_keywords = ['urgent', 'emergency', 'burst', 'live wire', 'accident', 'fire']
            if any(keyword in text_lower for keyword in high_priority_keywords) and predicted_priority == 'Low':
                predicted_priority = 'Medium'
                confidence = min(1.0, confidence + 0.2)

        return predicted_priority, float(confidence)

predictor = PriorityPredictor()
