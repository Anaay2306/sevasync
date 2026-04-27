import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor


def load_training_data(path: str = "../../data/community_requests.csv") -> pd.DataFrame:
    return pd.read_csv(path)


def train_models(df: pd.DataFrame) -> dict:
    features = [
        "people_affected",
        "severity",
        "vulnerability",
        "wait_hours",
        "weather_risk",
        "poverty_index",
        "repeated_reports",
    ]
    x = df[features]
    y_score = df["priority_score"]
    y_class = (df["priority_score"] >= 80).astype(int)
    x_train, x_test, y_train, y_test = train_test_split(x, y_class, test_size=0.25, random_state=42)

    random_forest = RandomForestClassifier(n_estimators=150, random_state=42).fit(x_train, y_train)
    logistic = LogisticRegression(max_iter=1000).fit(x_train, y_train)
    xgboost = XGBRegressor(n_estimators=120, max_depth=4, learning_rate=0.08, random_state=42).fit(x, y_score)

    print("Random Forest")
    print(classification_report(y_test, random_forest.predict(x_test)))
    print("Logistic Regression")
    print(classification_report(y_test, logistic.predict(x_test)))

    return {"random_forest": random_forest, "logistic_regression": logistic, "xgboost_regressor": xgboost}


if __name__ == "__main__":
    train_models(load_training_data())
