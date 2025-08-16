import { StyleSheet } from 'react-native';

export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fefcc3',
  },
  splashTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ee7200',
    marginBottom: 16,
    fontFamily: 'Kanit-Bold',
  },
  splashSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 32,
    fontFamily: 'Kanit-Regular',
  },
  appContainer: {
    flex: 1,
    backgroundColor: '#fefcc3',
    elevation: 5,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    backgroundColor: '#fefcc3',
    padding: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Nunito-Bold',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Nunito-Regular',
  },
  dashboardContainer: {
    flex: 1,
    paddingBottom: 80, // Space for footer
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 8,
    fontFamily: 'Nunito-Bold',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    fontFamily: 'Nunito-Regular',
  },
  footerNote: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    padding: 16,
    fontFamily: 'Nunito-Regular',
  },
  exerciseContainer: {
    flex: 1,
    paddingBottom: 80, // Space for footer
  },
  exerciseContent: {
    flex: 1,
    padding: 16,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  exerciseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#343a40',
    fontFamily: 'Nunito-Bold',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontFamily: 'Nunito-Regular',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#e9ecef',
    borderRadius: 5,
    overflow: 'hidden',
    marginVertical: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#74b9ff',
  },
  exerciseCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 8,
    fontFamily: 'Nunito-Bold',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    fontFamily: 'Nunito-Regular',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  primaryButton: {
    backgroundColor: '#ee7200',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
  },
  feedback: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  feedbackCorrect: {
    backgroundColor: 'rgba(46, 213, 115, 0.2)',
  },
  feedbackIncorrect: {
    backgroundColor: 'rgba(255, 71, 87, 0.2)',
  },
  feedbackIcon: {
    marginRight: 8,
  },
  feedbackText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
  },
  feedbackCorrectText: {
    color: '#2ed573',
  },
  feedbackIncorrectText: {
    color: '#ff4757',
  },
    scrollContent: {
      flexGrow: 1, 
    },
  orangeBackground: {
    width: '100%',
    borderRadius: 20,
    padding: 20, 
  },
});