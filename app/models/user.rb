class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :genre_relationships, dependent: :destroy
  has_many :genres, through: :genre_relationships, dependent: :destroy
  has_many :messages, dependent: :destroy

  has_many :active_relationships, class_name: "UserRelationship", foreign_key: :following_id
  has_many :followings, through: :active_relationships, source: :follower
  has_many :passive_relationships, class_name: "UserRelationship", foreign_key: :follower_id
  has_many :followers, through: :passive_relationships, source: :following

  validates :name, presence: true
  validates :introduction, length: {maximum: 300}
  validates :name, length: {maximum: 10}
  validates :age, numericality: {only_integer: true}, inclusion: { in: 18..100 }, allow_blank: true
  acts_as_paranoid
  attachment :user_image

  # フォローされているかの確認
  def followed_by?(user)
    passive_relationships.where(following_id: user.id).present?
  end

  # バンドマン検索
  def self.search(instrument,sex,age_st,age_ed,region,level,introduction)
    if instrument.blank?
      search_instrument = User.all
    else
      search_instrument = User.where(instrument: "#{instrument}")
    end

    if sex.blank?
      search_sex = search_instrument.all
    else
      search_sex = search_instrument.where(sex: "#{sex}")
    end

    if region.blank?
      search_region = search_sex.all
    else
      search_region = search_sex.where(region: "#{region}")
    end

    if level.blank?
      search_level = search_region.all
    else
      search_level = search_region.where(level: "#{level}")
    end

    if introduction.blank?
      search_introduction = search_level.all
    else
      search_introduction = search_level.where("introduction LIKE ?","%#{introduction}%")
    end

    if age_st.blank? || age_ed.blank?
      search_age = search_introduction.all
    else
      search_age = search_introduction.where(age: age_st..age_ed)
    end

  end
  
end
