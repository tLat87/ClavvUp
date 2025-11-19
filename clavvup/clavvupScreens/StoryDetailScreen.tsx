import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ImageBackground,
  Image,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Share } from 'react-native';
import { BACKGROUND_IMAGE } from '../clavvupConstants/Images';
import TwinklingStars from '../clavvupComponents/TwinklingStars';
import { stories } from '../clavvupData/stories';
import { Story } from '../clavvupTypes';

const { width, height } = Dimensions.get('window');

type StoriesStackParamList = {
  StoriesList: undefined;
  StoryDetail: { storyId: string };
};

type StoryDetailRouteProp = RouteProp<StoriesStackParamList, 'StoryDetail'>;
type NavigationProp = NativeStackNavigationProp<StoriesStackParamList>;

export default function StoryDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<StoryDetailRouteProp>();
  const storyId = route.params?.storyId;
  const story = stories.find(s => s.id === storyId);
  const currentIndex = storyId ? stories.findIndex(s => s.id === storyId) : -1;

  useEffect(() => {
    // Scroll to top when story changes
  }, [storyId]);

  if (!story || !storyId) {
    return (
      <View style={styles.container}>
        <ImageBackground source={BACKGROUND_IMAGE} style={styles.backgroundImage} resizeMode="cover">
          <View style={styles.contentWrapper}>
            <Text style={{ color: '#fff', fontSize: 18 }}>Story not found</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${story.title}\n\n${story.content}\n\n"${story.quote}"`,
        title: story.title,
      });
    } catch (error) {
      // User cancelled
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const previousStory = stories[currentIndex - 1];
      navigation.setParams({ storyId: previousStory.id });
    }
  };

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      const nextStory = stories[currentIndex + 1];
      navigation.setParams({ storyId: nextStory.id });
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={BACKGROUND_IMAGE} style={styles.backgroundImage} resizeMode="cover">
        <TwinklingStars count={30} />
        {/* Close Button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>

        {/* Share Button */}
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShare}
        >
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>

        <View style={styles.contentWrapper}>
          {/* Golden Marquee Frame */}
          <View style={styles.marqueeFrame}>
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              {/* Story Image */}
              <View style={styles.storyImageContainer}>
                {story.image ? (
                  <Image
                    source={story.image}
                    style={styles.storyImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.storyImagePlaceholder}>
                  </View>
                )}
              </View>

              {/* Title on Red Background */}
              <View style={styles.titleContainer}>
                <Text style={styles.storyTitleText}>{story.title}</Text>
              </View>

              {/* Story Content on Red Background */}
              <View style={styles.contentContainer}>
                <Text style={styles.storyContentText}>{story.content}</Text>
              </View>

              {/* Quote */}
              {story.quote && (
                <View style={styles.quoteContainer}>
                  <Text style={styles.quoteText}>"{story.quote}"</Text>
                </View>
              )}

              {/* Navigation Icons */}
              <View style={styles.navigationContainer}>
                <TouchableOpacity
                  onPress={handlePrevious}
                  style={styles.navButton}
                  disabled={currentIndex === 0}
                >
                  <Text style={[
                    styles.navIcon,
                    currentIndex === 0 && styles.navIconDisabled
                  ]}>←</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleNext}
                  style={styles.navButton}
                  disabled={currentIndex === stories.length - 1}
                >
                  <Text style={[
                    styles.navIcon,
                    currentIndex === stories.length - 1 && styles.navIconDisabled
                  ]}>→</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
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
  contentWrapper: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    paddingTop: 80,
    paddingBottom: 100,
  },
  marqueeFrame: {
    width: width * 0.9,
    maxWidth: 400,
    height: height * 0.75,
    backgroundColor: 'transparent',
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 20,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  storyImageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  storyImage: {
    width: '100%',
    height: '100%',
  },
  storyImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFE4B5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    backgroundColor: '#DC143C',
    padding: 16,
    alignItems: 'center',
  },
  storyTitleText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  contentContainer: {
    backgroundColor: '#DC143C',
    padding: 20,
  },
  storyContentText: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
    textAlign: 'left',
  },
  quoteContainer: {
    backgroundColor: '#DC143C',
    padding: 20,
    paddingTop: 0,
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#FFD700',
    textAlign: 'center',
    fontWeight: '600',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#DC143C',
    padding: 16,
    paddingHorizontal: 20,
  },
  navButton: {
    padding: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  navIconDisabled: {
    opacity: 0.3,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  shareButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(220, 20, 60, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 10,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

