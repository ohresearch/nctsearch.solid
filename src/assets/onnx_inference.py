import librosa
import numpy as np
import onnxruntime as rt

SAMPLE_RATE = 16000

def extract_features(audio_path: str) -> np.ndarray:
    X, sample_rate = librosa.load(audio_path, sr=SAMPLE_RATE)
    # win_length=512 corresponds to 30ms of audio signal
    mfccs_40 = librosa.feature.mfcc(y=X, sr=sample_rate, n_mfcc=40, win_length=512)
    #Plot MFCCs as image
    return mfccs_40


# Compute the prediction with ONNX Runtime

sess = rt.InferenceSession("breath_detection.onnx")
input_name = sess.get_inputs()[0].name
prediction_name = sess.get_outputs()[0].name
probability_name = sess.get_outputs()[1].name
eval_path = "/Users/david.e.ayala/Documents/data/respirate/drive/denoise_audio_labels/alandra14_denoised.wav"
eval_feats = extract_features(eval_path).transpose()
pred_onx = sess.run([prediction_name, probability_name], {input_name: eval_feats.astype(np.float32)})
print(pred_onx[0]) # Predictions
print(pred_onx[1]) # Probabilities
