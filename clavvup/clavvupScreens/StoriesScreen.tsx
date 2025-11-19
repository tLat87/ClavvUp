import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ImageBackground,
  Image,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { stories } from '../clavvupData/stories';
import { Story } from '../clavvupTypes';
import { Share } from 'react-native';
import { BACKGROUND_IMAGE } from '../clavvupConstants/Images';
import TwinklingStars from '../clavvupComponents/TwinklingStars';

const { width, height } = Dimensions.get('window');

type StoriesStackParamList = {
  StoriesList: undefined;
  StoryDetail: { storyId: string };
};

type NavigationProp = NativeStackNavigationProp<StoriesStackParamList>;

export default function StoriesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const cardAnimations = useRef(stories.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const animations = cardAnimations.map(anim =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      })
    );
    Animated.stagger(120, animations).start();
  }, [cardAnimations]);

  const handleStoryPress = (story: Story) => {
    navigation.navigate('StoryDetail', { storyId: story.id });
  };

  const handleShare = async (story: Story) => {
    try {
      await Share.share({
        message: `${story.title}\n\n${story.content}\n\n"${story.quote}"`,
        title: story.title,
      });
    } catch (error) {
      // User cancelled
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={BACKGROUND_IMAGE} style={styles.backgroundImage} resizeMode="cover">
        <TwinklingStars count={30} />
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          {stories.map((story, index) => (
            <Animated.View
              key={story.id}
              style={[
                styles.storyCardWrapper,
                {
                  opacity: cardAnimations[index],
                  transform: [
                    {
                      translateY: cardAnimations[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [40, 0],
                      }),
                    },
                    {
                      scale: cardAnimations[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.95, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
            <TouchableOpacity
              style={styles.storyCard}
              onPress={() => handleStoryPress(story)}
            >
              {/* Left Section - Thumbnail Image */}
              <View style={styles.thumbnailContainer}>
                {story.image ? (
                  <Image
                    source={story.image}
                    style={styles.thumbnailImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.thumbnailPlaceholder}>
                  </View>
                )}
              </View>

              {/* Right Section - Title and Icons */}
              <View style={styles.storyInfoContainer}>
                <Text style={styles.storyTitle}>{story.title}</Text>
                <View style={styles.iconsContainer}>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleStoryPress(story);
                    }}
                  >
                    <View style={styles.playIcon} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{backgroundColor: 'red', padding: 10, borderRadius: 10}}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleShare(story);
                    }}
                  >
                    <Text style={styles.shareIcon}>Share</Text>
                    {/* <Icon name="share" size={20} color="#fff" /> */}
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0a2e',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 40,
  },
  storyCard: {
    backgroundColor: '#DC143C',
    borderRadius: 16,
    borderWidth: 4,
    borderColor: '#FFD700',
    overflow: 'hidden',
    flexDirection: 'row',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 15,
    // Marquee lights effect
    position: 'relative',
  },
  storyCardWrapper: {
    marginBottom: 20,
  },
  thumbnailContainer: {
    width: 120,
    height: 120,
    margin: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFE4B5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailEmoji: {
    fontSize: 50,
  },
  storyInfoContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  storyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    lineHeight: 24,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 0,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: '#fff',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: 'transparent',
    marginLeft: 4,
  },
  shareIcon: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
});
