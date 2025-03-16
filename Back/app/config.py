import os
from pydantic_settings import BaseSettings
from pydantic import Field
from typing import List

class Settings(BaseSettings):
    """
    アプリケーション設定
    """
    # アップロード設定
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS: List[str] = ["csv", "xlsx", "xls"]
    
    # 必須カラム設定
    REQUIRED_COLUMNS: List[str] = ["company_name"]
    
    # 環境設定
    ENVIRONMENT: str = Field(default="development")
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

# 設定のインスタンス化
settings = Settings()